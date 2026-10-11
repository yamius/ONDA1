//
//  BreatheNowView.swift
//  Task 076 stage 0 — target of the ONDA complication tap (ondalife://breathe).
//  A self-contained 1-minute visual breathing guide. Reads no sensors,
//  writes nothing, sends nothing.
//

import SwiftUI

struct BreatheNowView: View {
    @Environment(\.dismiss) private var dismiss
    @State private var expanded = false
    @State private var inhale = true
    @State private var secondsLeft = 60
    private let ticker = Timer.publish(every: 1, on: .main, in: .common).autoconnect()

    var body: some View {
        VStack(spacing: 8) {
            ZStack {
                Circle()
                    .fill(Color.accentColor.opacity(0.35))
                    .scaleEffect(expanded ? 1.0 : 0.45)
                Text(secondsLeft > 0 ? (inhale ? "Inhale" : "Exhale") : "Done")
                    .font(.headline)
            }
            .frame(width: 110, height: 110)
            Text("\(secondsLeft)s")
                .font(.footnote)
                .foregroundStyle(.secondary)
            if secondsLeft == 0 {
                Button("Close") { dismiss() }
            }
        }
        .onAppear { breathe() }
        .onReceive(ticker) { _ in
            guard secondsLeft > 0 else { return }
            secondsLeft -= 1
        }
    }

    // 4 s in / 6 s out, repeated until the minute is over.
    private func breathe() {
        guard secondsLeft > 0 else { return }
        inhale = true
        withAnimation(.easeInOut(duration: 4)) { expanded = true }
        DispatchQueue.main.asyncAfter(deadline: .now() + 4) {
            inhale = false
            withAnimation(.easeInOut(duration: 6)) { expanded = false }
            DispatchQueue.main.asyncAfter(deadline: .now() + 6) { breathe() }
        }
    }
}
