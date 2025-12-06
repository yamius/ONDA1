import SwiftUI
import HealthKit

struct ContentView: View {
    @EnvironmentObject var workoutManager: WorkoutManager

    var body: some View {
        VStack(spacing: 4) {
            // Connection status + auth status
            HStack(spacing: 4) {
                Circle()
                    .fill(workoutManager.connectionStatus == "OK" ? Color.green : Color.orange)
                    .frame(width: 6, height: 6)
                Text(workoutManager.connectionStatus)
                    .font(.system(size: 10))
                    .foregroundColor(.secondary)
                Text("|")
                    .font(.system(size: 10))
                    .foregroundColor(.secondary)
                Circle()
                    .fill(authStatusColor)
                    .frame(width: 6, height: 6)
                Text(workoutManager.authorizationStatus.rawValue)
                    .font(.system(size: 10))
                    .foregroundColor(.secondary)
            }
            
            // Send info
            HStack(spacing: 4) {
                Text("\(workoutManager.sendCount)")
                    .font(.system(size: 10))
                    .foregroundColor(.blue)
                Text(workoutManager.lastSendResult)
                    .font(.system(size: 10))
                    .foregroundColor(workoutManager.lastSendResult == "OK" ? .green : .orange)
            }
            
            // Heart rate display
            Text(workoutManager.heartRateString)
                .font(.system(size: 44, weight: .bold, design: .rounded))
                .foregroundColor(workoutManager.isRunning ? .red : .primary)
            
            Text("BPM")
                .font(.caption2)
                .foregroundColor(.secondary)
            
            // Error/Status message
            if !workoutManager.errorMessage.isEmpty {
                Text(workoutManager.errorMessage)
                    .font(.system(size: 10))
                    .foregroundColor(.orange)
            } else if workoutManager.authorizationStatus == .requesting {
                Text("Allow HealthKit access")
                    .font(.system(size: 10))
                    .foregroundColor(.blue)
            } else if workoutManager.authorizationStatus == .denied {
                Text("Open Settings to allow")
                    .font(.system(size: 10))
                    .foregroundColor(.orange)
            }
            
            // Start/Stop button
            Button(action: {
                if workoutManager.isRunning {
                    workoutManager.stopWorkout()
                } else {
                    workoutManager.startWorkout()
                }
            }) {
                Text(buttonText)
                    .font(.subheadline)
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .tint(buttonColor)
            .disabled(!workoutManager.isAuthorized && !workoutManager.isRunning)
        }
        .padding(.horizontal, 6)
        .onAppear {
            workoutManager.activateSession()
        }
        .onChange(of: workoutManager.authorizationStatus) { newStatus in
            if newStatus == .authorized && !workoutManager.isRunning {
                print("[Watch UI] Authorization granted, auto-starting workout")
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.5) {
                    workoutManager.startWorkout()
                }
            }
        }
    }
    
    private var authStatusColor: Color {
        switch workoutManager.authorizationStatus {
        case .authorized:
            return .green
        case .requesting:
            return .blue
        case .denied, .notAvailable:
            return .red
        case .unknown:
            return .orange
        }
    }
    
    private var buttonText: String {
        if workoutManager.isRunning {
            return "Stop"
        } else if !workoutManager.isAuthorized {
            return "Waiting..."
        } else {
            return "Start"
        }
    }
    
    private var buttonColor: Color {
        if workoutManager.isRunning {
            return .red
        } else if !workoutManager.isAuthorized {
            return .gray
        } else {
            return .green
        }
    }
}
