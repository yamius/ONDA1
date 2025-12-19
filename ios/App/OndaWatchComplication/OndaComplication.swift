import WidgetKit
import SwiftUI

private enum OndaComplicationConstants {
    static let kind = "OndaComplication"
}

struct OndaComplicationEntry: TimelineEntry {
    let date: Date
    let bpmText: String
}

struct OndaComplicationProvider: TimelineProvider {
    func placeholder(in context: Context) -> OndaComplicationEntry {
        OndaComplicationEntry(date: Date(), bpmText: "--")
    }

    func getSnapshot(in context: Context, completion: @escaping (OndaComplicationEntry) -> Void) {
        completion(OndaComplicationEntry(date: Date(), bpmText: "--"))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<OndaComplicationEntry>) -> Void) {
        // Minimal implementation: we don't depend on shared storage yet.
        // The goal of this branch is to enable a watch face complication and keep the app more resident.
        let now = Date()
        let entry = OndaComplicationEntry(date: now, bpmText: "--")

        // Refresh periodically (keeps complication alive without spamming reloads).
        let next = Calendar.current.date(byAdding: .minute, value: 5, to: now) ?? now.addingTimeInterval(300)
        completion(Timeline(entries: [entry], policy: .after(next)))
    }
}

struct OndaComplicationView: View {
    var entry: OndaComplicationProvider.Entry

    var body: some View {
        // Accessory widgets are the modern complications on watchOS.
        ZStack {
            AccessoryWidgetBackground()
            Text("♥ \(entry.bpmText)")
                .font(.system(size: 14, weight: .semibold, design: .rounded))
                .minimumScaleFactor(0.7)
        }
    }
}

@main
struct OndaComplication: Widget {
    var body: some WidgetConfiguration {
        StaticConfiguration(kind: OndaComplicationConstants.kind, provider: OndaComplicationProvider()) { entry in
            OndaComplicationView(entry: entry)
        }
        .configurationDisplayName("ONDA")
        .description("Shows ONDA status on the watch face.")
        .supportedFamilies([
            .accessoryCircular,
            .accessoryInline,
            .accessoryRectangular,
        ])
    }
}
