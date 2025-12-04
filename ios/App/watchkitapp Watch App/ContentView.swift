import SwiftUI

struct ContentView: View {
    @StateObject private var workoutManager = WorkoutManager.shared
    
    var body: some View {
        VStack(spacing: 20) {
            Text("ONDA")
                .font(.title2)
                .fontWeight(.bold)
            
            Text("\(Int(workoutManager.heartRate))")
                .font(.system(size: 60, weight: .bold))
                .foregroundColor(.red)
            
            Text("BPM")
                .font(.caption)
                .foregroundColor(.gray)
            
            Button(action: {
                if workoutManager.isActive {
                    workoutManager.stopWorkout()
                } else {
                    workoutManager.requestAuthorization()
                    workoutManager.startWorkout()
                }
            }) {
                Text(workoutManager.isActive ? "Stop" : "Start")
                    .font(.headline)
                    .frame(maxWidth: .infinity)
            }
            .buttonStyle(.borderedProminent)
            .tint(workoutManager.isActive ? .red : .green)
        }
        .padding()
    }
}
