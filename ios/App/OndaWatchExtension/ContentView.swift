import SwiftUI

struct ContentView: View {
    @EnvironmentObject var workoutManager: WorkoutManager

    var body: some View {
        VStack(spacing: 2) {
            HStack {
                Text("Onda")
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(.secondary)
                Spacer()
                Text(workoutManager.connectionStatus)
                    .font(.system(size: 10, weight: .medium))
                    .foregroundColor(workoutManager.connectionStatus == "OK" ? .green : .orange)
            }
            .padding(.horizontal, 2)
            
            Spacer()
            
            Text(workoutManager.heartRateString)
                .font(.system(size: 48, weight: .bold, design: .rounded))
                .foregroundColor(workoutManager.isRunning ? .red : .primary)

            Text("BPM")
                .font(.system(size: 11, weight: .medium))
                .foregroundColor(.secondary)
            
            Spacer()

            Button(action: {
                if workoutManager.isRunning {
                    workoutManager.stopWorkout()
                } else {
                    workoutManager.startWorkout()
                }
            }) {
                Text(workoutManager.isRunning ? "Stop" : "Start")
                    .font(.system(size: 15, weight: .semibold))
            }
            .buttonStyle(.borderedProminent)
            .tint(workoutManager.isRunning ? .red : .green)
        }
        .padding(.horizontal, 2)
        .padding(.vertical, 2)
        .onAppear {
            workoutManager.activateSession()
        }
    }
}
