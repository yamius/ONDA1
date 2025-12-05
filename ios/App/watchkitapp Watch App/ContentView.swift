import SwiftUI
import HealthKit

struct ContentView: View {
    @EnvironmentObject var workoutManager: WorkoutManager

    var body: some View {
        VStack(spacing: 8) {
            // Connection status
            HStack {
                Circle()
                    .fill(workoutManager.connectionStatus == "OK" ? Color.green : Color.orange)
                    .frame(width: 8, height: 8)
                Text(workoutManager.connectionStatus)
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
            
            // Heart rate display
            Text(workoutManager.heartRateString)
                .font(.system(size: 48, weight: .bold, design: .rounded))
                .foregroundColor(workoutManager.isRunning ? .red : .primary)
            
            Text("BPM")
                .font(.caption)
                .foregroundColor(.secondary)
            
            // Error message if any
            if !workoutManager.errorMessage.isEmpty {
                Text(workoutManager.errorMessage)
                    .font(.caption2)
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
                Text(workoutManager.isRunning ? "Stop" : "Start")
                    .font(.headline)
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .tint(workoutManager.isRunning ? .red : .green)
        }
        .padding(.horizontal, 8)
        .onAppear {
            workoutManager.activateSession()
        }
    }
}
