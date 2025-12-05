import SwiftUI

struct ContentView: View {
    @EnvironmentObject var workoutManager: WorkoutManager

    var body: some View {
        VStack(spacing: 4) {
            HStack {
                Text("Onda Life")
                    .font(.system(size: 12, weight: .medium))
                    .foregroundColor(.secondary)
                Spacer()
            }
            
            Spacer()
            
            Text(workoutManager.heartRateString)
                .font(.system(size: 52, weight: .bold, design: .rounded))
                .foregroundColor(workoutManager.isRunning ? .red : .primary)

            Text("BPM")
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(.secondary)
            
            Spacer()

            if workoutManager.isRunning {
                Button(action: {
                    workoutManager.stopWorkout()
                }) {
                    Text("Stop")
                        .font(.system(size: 16, weight: .semibold))
                }
                .buttonStyle(.borderedProminent)
                .tint(.red)
                .controlSize(.regular)
            } else {
                Button(action: {
                    workoutManager.startWorkout()
                }) {
                    Text("Start")
                        .font(.system(size: 16, weight: .semibold))
                }
                .buttonStyle(.borderedProminent)
                .tint(.green)
                .controlSize(.regular)
            }
        }
        .padding(.horizontal, 4)
        .padding(.vertical, 2)
        .onAppear {
            workoutManager.activateSession()
        }
    }
}
