//
//  ContentView.swift
//  OndaWatch Watch App
//
//  Created by user945497 on 12/3/25.
//

import SwiftUI
import HealthKit

struct ContentView: View {
    @StateObject private var workoutManager = WorkoutManager.shared
    
    var body: some View {
        VStack(spacing: 12) {
            // App icon/logo
            Image(systemName: "waveform.path.ecg")
                .font(.system(size: 40))
                .foregroundColor(.cyan)
            
            Text("ONDA")
                .font(.title2)
                .fontWeight(.bold)
            
            // Heart rate display
            if workoutManager.isActive {
                HStack {
                    Image(systemName: "heart.fill")
                        .foregroundColor(.red)
                    Text("\(Int(workoutManager.heartRate))")
                        .font(.title)
                        .fontWeight(.semibold)
                    Text("BPM")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .padding(.vertical, 8)
            }
            
            // Status indicator
            HStack(spacing: 6) {
                Circle()
                    .fill(workoutManager.isActive ? Color.green : Color.gray)
                    .frame(width: 8, height: 8)
                Text(workoutManager.isActive ? "Активна" : "Ожидание")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            // Authorization status warning
            if workoutManager.authorizationStatus == .sharingDenied {
                VStack(spacing: 4) {
                    Image(systemName: "exclamationmark.triangle.fill")
                        .foregroundColor(.orange)
                    Text("Нет доступа к данным")
                        .font(.caption2)
                        .foregroundColor(.orange)
                    Text("Настройки → Здоровье")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                }
                .padding(.top, 8)
            }
        }
        .padding()
        .onAppear {
            // Check and request authorization every time app appears
            print("[ContentView] App appeared, checking authorization")
            workoutManager.checkAndRequestAuthorization()
        }
    }
}

#Preview {
    ContentView()
}
