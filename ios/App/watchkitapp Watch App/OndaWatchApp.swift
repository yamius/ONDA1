//
//  OndaWatchApp.swift
//  OndaWatch Watch App
//
//  Created by user945497 on 12/3/25.
//

import SwiftUI
import WatchConnectivity

@main
struct OndaWatchApp: App {
    @StateObject private var workoutManager = WorkoutManager.shared
    
    init() {
        let bundleId = Bundle.main.bundleIdentifier ?? "unknown"
        print("🚀 [WatchApp] OndaWatchApp init - bundle: \(bundleId)")
        
        // Отправляем лог на iPhone через applicationContext
        if WCSession.isSupported() {
            let session = WCSession.default
            if session.activationState == .activated {
                try? session.updateApplicationContext([
                    "watchAppStarted": true,
                    "bundleId": bundleId,
                    "timestamp": Date().timeIntervalSince1970,
                    "target": "watchkitapp"
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
