import SwiftUI
import HealthKit

struct ContentView: View {
    @EnvironmentObject var workoutManager: WorkoutManager
    
    var body: some View {
        VStack(spacing: 16) {
            HStack {
                Circle()
                    .fill(workoutManager.isSessionActive ? Color.green : Color.gray)
                    .frame(width: 8, height: 8)
                Text(workoutManager.isSessionActive ? "Active" : "Idle")
                    .font(.caption2)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            VStack(spacing: 4) {
                Image(systemName: "heart.fill")
                    .font(.system(size: 32))
                    .foregroundColor(.red)
                
                Text("\(workoutManager.heartRate)")
                    .font(.system(size: 64, weight: .bold, design: .rounded))
                    .foregroundColor(.white)
                
                Text("BPM")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            
            Spacer()
            
            Button(action: {
                if workoutManager.isSessionActive {
                    workoutManager.stopWorkout()
                } else {
                    workoutManager.startWorkout()
                }
            }) {
                HStack {
                    Image(systemName: workoutManager.isSessionActive ? "stop.fill" : "play.fill")
                    Text(workoutManager.isSessionActive ? "Stop" : "Start")
                }
                .font(.headline)
                .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .tint(workoutManager.isSessionActive ? .red : .green)
        }
        .padding()
        .onAppear {
            workoutManager.requestAuthorization()
        }
    }
}

#Preview {
    ContentView()
        .environmentObject(WorkoutManager())
}
