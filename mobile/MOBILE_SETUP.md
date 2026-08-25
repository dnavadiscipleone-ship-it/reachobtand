# 📱 Vehicle Tow Tracker - Mobile App Setup

A complete guide to getting the React Native app running on your Android and iPhone devices.

## 🚀 Quick Start (10 minutes)

### Prerequisites
- Node.js installed (from earlier setup)
- Computer and phone on same WiFi
- Your computer's IP address

### Step 1: Find Your Computer's IP Address

**Windows:**
1. Open Command Prompt
2. Type: `ipconfig`
3. Look for "IPv4 Address" (example: `192.168.1.100`)

**Mac:**
1. Open Terminal
2. Type: `ifconfig`
3. Look for "inet" address under "en0" (example: `192.168.1.100`)

### Step 2: Update API URL in the App

Open these files and replace `192.168.1.100` with YOUR computer's IP:

1. `mobile/src/screens/SearchScreen.tsx` (line 13)
2. `mobile/src/screens/VehicleDetailsScreen.tsx` (line 14)
3. `mobile/src/screens/TowYardsScreen.tsx` (line 13)
4. `mobile/src/screens/CallsScreen.tsx` (line 8)

Change:
```
const API_URL = 'http://192.168.1.100:5000/api';
```

To (using YOUR IP):
```
const API_URL = 'http://YOUR.IP.HERE:5000/api';
```

### Step 3: Install Expo & Dependencies

Open Command Prompt/Terminal in the mobile folder:

```bash
cd mobile
npm install
```

Wait for it to finish (2-3 minutes).

### Step 4: Start the Mobile App

```bash
npm start
```

You'll see a QR code in the terminal. ✨

### Step 5: Install Expo Go App

**On Your Android or iPhone:**
1. Go to Google Play Store (Android) or App Store (iPhone)
2. Search for "Expo Go"
3. Install it

### Step 6: Scan QR Code

1. Open **Expo Go** app
2. Tap **Scan QR Code**
3. Point your phone at the QR code in your terminal
4. App loads on your phone! 🎉

---

## 📲 Using the Mobile App

### Tab 1: Find Vehicles
- Search by license plate or VIN
- See list of matching vehicles
- Tap to view full details
- Call tow yard directly
- Get directions on Google Maps

### Tab 2: Calling (Go High Life)
- **Find Customers**: List of AT&T customers to call
- **Call Now**: Click to call customer directly
- **Log Calls**: Add notes after each call
- **Call Logs**: History of all calls made
- Track outcomes: Interested, Not Interested, Callback

### Tab 3: Tow Yards
- Browse all tow yards in area
- See live capacity (how full they are)
- Hours and payment methods
- Call yard or get directions

---

## 🔧 Troubleshooting

### "Cannot connect to server"
- Make sure your computer's backend is running (`npm run server`)
- Check that you used the correct IP address
- Make sure phone and computer are on same WiFi

### "Blank screen" on phone
- Wait a few seconds for app to load
- Check the terminal for error messages
- Make sure all npm packages installed

### "QR code won't scan"
- Make sure Expo Go app is installed
- Try increasing brightness on your computer screen
- Manually enter the connection info if QR doesn't work

### Reset Everything
```bash
# Kill the app
Press Ctrl+C in terminal

# Clear cache
npm start --clear

# Then scan QR code again
```

---

## 🔐 Important: Update IP Address

⚠️ **EVERY TIME** you restart your app, check your IP address hasn't changed:

```bash
ipconfig  (Windows)
ifconfig  (Mac)
```

If different from before, update the URLs in the 4 screen files.

---

## 🏗️ Building a Real App (Advanced)

To create an actual installable app file:

### Android APK
```bash
npm install -g eas-cli
eas build --platform android --local
```

### iPhone App
```bash
eas build --platform ios --local
```

(Requires Apple Developer account)

---

## 📱 Testing Checklist

- [ ] App opens in Expo Go
- [ ] Can search for vehicles
- [ ] Vehicle details load
- [ ] Can see tow yards
- [ ] Call button works
- [ ] Directions opens Google Maps
- [ ] Call logs save

---

## Getting Help

If something goes wrong:
1. Check terminal for error messages
2. Restart both server and app
3. Make sure IP address is correct
4. Try clearing cache: `npm start --clear`

Happy calling! 📞🚗
