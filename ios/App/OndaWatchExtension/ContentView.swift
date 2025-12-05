import SwiftUI

struct ContentView: View {
    @EnvironmentObject var workoutManager: WorkoutManager

    var body: some View {
        VStack(spacing: 8) {
            HStack {
                Text("Onda Life")
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(.secondary)
                Spacer()
            }
            .padding(.horizontal, 4)
            
            Spacer()
            
            Text(workoutManager.heartRateString)
                .font(.system(size: 56, weight: .bold, design: .rounded))
                .foregroundColor(workoutManager.isRunning ? .red : .primary)

            Text("BPM")
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(.secondary)
            
            Spacer()

            if workoutManager.isRunning {
                Button(action: {
                    workoutManager.stopWorkout()
                }) {
                    Text("Stop")
                        .font(.system(size: 18, weight: .semibold))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                }
                .buttonStyle(.borderedProminent)
                .tint(.red)
            } else {
                Button(action: {
                    workoutManager.startWorkout()
                }) {
                    Text("Start")
                        .font(.system(size: 18, weight: .semibold))
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 12)
                }
                .buttonStyle(.borderedProminent)
                .tint(.green)
            }
        }
        .padding(.horizontal, 8)
        .padding(.bottom, 4)
        .onAppear {
            workoutManager.activateSession()
        }
    }
}
