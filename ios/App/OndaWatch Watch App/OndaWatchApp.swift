//
//  OndaWatchApp.swift
//  OndaWatch Watch App
//
//  Created by user945497 on 12/3/25.
//

import SwiftUI
import WatchConnectivity

@main
struct OndaWatch_Watch_AppApp: App {
    @StateObject private var workoutManager = WorkoutManager.shared
    
    init() {
        let bundleId = Bundle.main.bundleIdentifier ?? "unknown"
        print("🚀 [WatchApp] OndaWatch_Watch_AppApp init - bundle: \(bundleId)")
        
        _ = NotificationManager.shared
        
        // Отправляем лог на iPhone через applicationContext
        if WCSession.isSupported() {
            let session = WCSession.default
            if session.activationState == .activated {
                try? session.updateApplicationContext([
                    "watchAppStarted": true,
                    "bundleId": bundleId,
                    "timestamp": Date().timeIntervalSince1970,
                    "target": "OndaWatch"
                ])
            }
        }
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(workoutManager)
        }
    }
}
