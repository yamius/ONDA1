//
//  ContentView.swift
//  OndaWatch Watch App
//
//  Created by user945497 on 12/3/25.
//

import SwiftUI
import HealthKit
import WatchKit

struct ContentView: View {
    @StateObject private var workoutManager = WorkoutManager.shared
    @State private var hasRequestedPermission = false
    @State private var showPermissionHint = true
    
    var body: some View {
        VStack(spacing: 8) {
            // App icon/logo
            Image(systemName: "waveform.path.ecg")
                .font(.system(size: 36))
                .foregroundColor(.cyan)
            
            Text("ONDA")
                .font(.title3)
                .fontWeight(.bold)
            
            // Heart rate display
            if workoutManager.heartRate > 0 {
                HStack {
                    Image(systemName: "heart.fill")
                        .foregroundColor(.red)
                    Text("\(Int(workoutManager.heartRate))")
                        .font(.title2)
                        .fontWeight(.semibold)
                    Text("BPM")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
                .padding(.vertical, 4)
            }
            
            // Status indicator
            HStack(spacing: 6) {
                Circle()
                    .fill(workoutManager.isActive ? Color.green : Color.gray)
                    .frame(width: 8, height: 8)
                Text(workoutManager.isActive ? "Активна" : "Ожидание")
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
            
            // Permission hint - show when no HR data received yet
            if showPermissionHint && workoutManager.heartRate == 0 {
                VStack(spacing: 6) {
                    Text("Разрешите доступ к данным о здоровье")
                        .font(.caption2)
                        .foregroundColor(.orange)
                        .multilineTextAlignment(.center)
                    
                    Button(action: {
                        workoutManager.checkAndRequestAuthorization()
                        hasRequestedPermission = true
                    }) {
                        HStack(spacing: 4) {
                            Image(systemName: "heart.fill")
                                .font(.caption2)
                            Text("Дать разрешение")
                                .font(.caption2)
                        }
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.green)
                    
                    if hasRequestedPermission {
                        Button(action: {
                            if let url = URL(string: "x-apple-health://") {
                                WKExtension.shared().openSystemURL(url)
                            }
                        }) {
                            Text("Открыть Здоровье")
                                .font(.caption2)
                        }
                        .buttonStyle(.bordered)
                        .tint(.blue)
                    }
                }
                .padding(.top, 4)
            }
        }
        .padding(.horizontal, 8)
        .onAppear {
            print("[ContentView] App appeared, checking authorization")
            workoutManager.checkAndRequestAuthorization()
        }
        .onChange(of: workoutManager.heartRate) { newValue in
            if newValue > 0 {
                showPermissionHint = false
            }
        }
    }
}

#Preview {
    ContentView()
}
