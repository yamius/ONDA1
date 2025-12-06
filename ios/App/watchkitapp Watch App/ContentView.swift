import SwiftUI
import HealthKit

struct ContentView: View {
    @EnvironmentObject var workoutManager: WorkoutManager

    var body: some View {
        VStack(spacing: 4) {
            // Connection status + send info
            HStack(spacing: 4) {
                Circle()
                    .fill(workoutManager.connectionStatus == "OK" ? Color.green : Color.orange)
                    .frame(width: 6, height: 6)
                Text(workoutManager.connectionStatus)
                    .font(.system(size: 10))
                    .foregroundColor(.secondary)
                Text("|\(workoutManager.sendCount)")
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
            
            // Error message if any
            if !workoutManager.errorMessage.isEmpty {
                Text(workoutManager.errorMessage)
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
                Text(workoutManager.isRunning ? "Stop" : "Start")
                    .font(.subheadline)
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .tint(workoutManager.isRunning ? .red : .green)
        }
        .padding(.horizontal, 6)
        .onAppear {
            workoutManager.activateSession()
            // Автозапуск workout при открытии
            DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
                if !workoutManager.isRunning {
                    print("[Watch UI] Auto-starting workout")
                    workoutManager.startWorkout()
                }
            }
        }
    }
}
