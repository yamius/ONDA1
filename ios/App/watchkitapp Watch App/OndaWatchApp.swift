//
//  OndaWatchApp.swift
//  OndaWatch Watch App
//
//  Created by user945497 on 12/3/25.
//

import SwiftUI

@main
struct OndaWatchApp: App {
    @StateObject private var workoutManager = WorkoutManager.shared
    
    init() {
        _ = NotificationManager.shared
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(workoutManager)
        }
    }
}
