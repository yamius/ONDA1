import SwiftUI

struct ContentView: View {
    @StateObject private var workoutManager = WorkoutManager()
    
    var body: some View {
        VStack(spacing: 20) {
            Text("Onda Life")
                .font(.headline)
            
            Text("\(Int(workoutManager.heartRate))")
                .font(.system(size: 60, weight: .bold, design: .rounded))
                .foregroundColor(.red)
            
            Text("BPM")
                .font(.caption)
                .foregroundColor(.secondary)
            
            Button(action: {
                if workoutManager.isActive {
                    workoutManager.stopWorkout()
                } else {
                    workoutManager.startWorkout()
                }
            }) {
                Text(workoutManager.isActive ? "Stop" : "Start")
                    .frame(maxWidth: .infinity)
            }
            #if os(watchOS)
            .buttonStyle(.borderedProminent)
            .tint(workoutManager.isActive ? .red : .green)
            #endif
        }
        .padding()
    }
}

#Preview {
    ContentView()
}
