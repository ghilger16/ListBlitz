
#!/bin/bash

# Optional argument to skip full boot and only start/reconnect Metro
if [[ "$1" == "--refresh" ]]; then
  echo "♻️ Refresh mode: Skipping simulator boot and app install, only starting Metro..."
  npx expo start --dev-client --lan
  exit 0
fi

# List of simulators to boot and run the app on
DEVICES=(
  "iPhone SE (3rd generation)"
  "iPhone 17"
  "iPhone 17 Pro Max"
  "iPad (10th generation)"
  "iPad Pro 13-inch (M4)"
)

echo "🛑 Closing existing Simulators and Metro processes..."
killall Simulator || true
killall node || true
lsof -ti :8081 | xargs kill -9 || true
echo "✅ Clean slate ready."

# Detect latest iOS runtime
IOS_RUNTIME=$(xcrun simctl list runtimes | grep "iOS" | grep "available" | tail -n 1 | awk '{print $NF}')
echo "📱 Using iOS runtime: $IOS_RUNTIME"

# Auto-create missing simulators
for DEVICE_NAME in "${DEVICES[@]}"; do
  if ! xcrun simctl list devices | grep -q "$DEVICE_NAME ("; then
    DEVICE_TYPE=$(xcrun simctl list devicetypes | grep "$DEVICE_NAME (" | awk '{print $NF}')
    if [ -n "$DEVICE_TYPE" ]; then
      echo "🆕 Creating missing simulator: $DEVICE_NAME"
      xcrun simctl create "$DEVICE_NAME" "$DEVICE_TYPE" "$IOS_RUNTIME" || true
    else
      echo "⚠️ Could not find device type for $DEVICE_NAME. Check your Xcode device types."
    fi
  else
    echo "✅ Simulator exists: $DEVICE_NAME"
  fi
done

# Step 1: Boot all simulators
for DEVICE_NAME in "${DEVICES[@]}"; do
  echo "➡️ Booting $DEVICE_NAME..."
  xcrun simctl boot "$DEVICE_NAME" || true
done

# Step 2: Open Simulator app UI
open -a Simulator

# Step 3: Start Expo in LAN mode
echo "🚀 Starting Expo dev server (LAN mode)..."
npx expo start --dev-client --lan &
sleep 15 # Give Metro some time to start

# Step 4: Install dev client
FIRST_DEVICE=""
for DEVICE_NAME in "${DEVICES[@]}"; do
  if xcrun simctl list devices available | grep -q "$DEVICE_NAME ("; then
    if [ -z "$FIRST_DEVICE" ]; then
      FIRST_DEVICE="$DEVICE_NAME"
      echo "📱 Building & installing dev client on first device: $FIRST_DEVICE"
      npx expo run:ios --device "$FIRST_DEVICE"
      APP_PATH=$(xcrun simctl get_app_container "$FIRST_DEVICE" com.listblitz.app || true)
    else
      echo "📱 Installing dev client on $DEVICE_NAME..."
      UDID=$(xcrun simctl list devices | grep "$DEVICE_NAME (" | head -n 1 | awk '{print $NF}' | tr -d '()')
      if [ -n "$UDID" ] && [ -n "$APP_PATH" ]; then
        xcrun simctl install "$UDID" "$APP_PATH"
      else
        echo "⚠️ Skipping $DEVICE_NAME, could not get UDID or app path."
      fi
    fi
  else
    echo "⚠️ Skipping $DEVICE_NAME (not available on this Mac)"
  fi
done

# Step 5: Open the app URL on all devices
PROJECT_URL="exp+list-blitz://expo-development-client/?url=http://localhost:8081"
for DEVICE_NAME in "${DEVICES[@]}"; do
  UDID=$(xcrun simctl list devices | grep "$DEVICE_NAME (" | head -n 1 | awk '{print $NF}' | tr -d '()')
  if [ -n "$UDID" ]; then
    echo "🔗 Launching app on $DEVICE_NAME..."
    xcrun simctl openurl "$UDID" "$PROJECT_URL"
  else
    echo "⚠️ Could not find UDID for $DEVICE_NAME to open URL."
  fi
done

echo ""
echo "✅ All simulators booted, dev client installed, and app launched on all devices!"
echo ""