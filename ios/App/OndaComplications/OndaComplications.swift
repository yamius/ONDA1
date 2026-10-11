//
//  OndaComplications.swift
//  Task 076 stage 0 — one static WidgetKit complication ("Breathe").
//  No health data: the timeline is a single static entry.
//  Tap opens the ONDA watch app with ondalife://breathe → BreatheNowView.
//

import SwiftUI
import WidgetKit

struct BreatheEntry: TimelineEntry {
    let date: Date
}

struct BreatheProvider: TimelineProvider {
    func placeholder(in context: Context) -> BreatheEntry { BreatheEntry(date: Date()) }

    func getSnapshot(in context: Context, completion: @escaping (BreatheEntry) -> Void) {
        completion(BreatheEntry(date: Date()))
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<BreatheEntry>) -> Void) {
        // Static content — never needs a refresh.
        completion(Timeline(entries: [BreatheEntry(date: Date())], policy: .never))
    }
}

struct BreatheComplicationView: View {
    @Environment(\.widgetFamily) private var family
    let entry: BreatheEntry

    var body: some View {
        switch family {
        case .accessoryCorner:
            Image("OndaMark")
                .resizable()
                .scaledToFit()
                .clipShape(Circle())
                .widgetLabel("ONDA · Breathe")
        case .accessoryRectangular:
            HStack(spacing: 6) {
                Image("OndaMark")
                    .resizable()
                    .scaledToFit()
                    .clipShape(Circle())
                    .frame(width: 30, height: 30)
                VStack(alignment: .leading, spacing: 0) {
                    Text("ONDA")
                        .font(.headline)
                        .widgetAccentable()
                    Text("Breathe · 1 min")
                        .font(.caption2)
                }
                Spacer(minLength: 0)
            }
        default: // .accessoryCircular
            ZStack {
                AccessoryWidgetBackground()
                Image("OndaMark")
                    .resizable()
                    .scaledToFit()
                    .clipShape(Circle())
                    .padding(4)
            }
        }
    }
}

@main
struct OndaBreatheComplication: Widget {
    let kind = "OndaBreatheComplication"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: BreatheProvider()) { entry in
            BreatheComplicationView(entry: entry)
                .containerBackground(.clear, for: .widget)
                .widgetURL(URL(string: "ondalife://breathe"))
        }
        .configurationDisplayName("ONDA Breathe")
        .description("Opens a 1-minute breathing practice.")
        .supportedFamilies([.accessoryCircular, .accessoryCorner, .accessoryRectangular])
    }
}
