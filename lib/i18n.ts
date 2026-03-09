export type Locale = "en" | "ja";

export const translations = {
  en: {
    langToggle: "日本語",
    nav: {
      brand: "tomotomo",
    },
    home: {
      tagline:
        "Create an event, share a QR code, and collect RSVPs — with a LINE group link revealed only after guests sign up.",
      createButton: "Create an Event",
      howItWorks: "How it works",
      steps: [
        "Fill in your event details and LINE group link",
        "Share the QR code with your guests",
        "Guests scan the code and enter their name to RSVP",
        "After RSVPing, guests see the LINE group join link",
      ],
    },
    create: {
      title: "Create Event",
      eventName: "Event Name",
      description: "Description",
      participantLimit: "Participant Limit",
      participantLimitHint: "leave blank for unlimited",
      lineGroupUrl: "LINE Group Invite URL",
      lineGroupUrlHint: "optional — shown after RSVP",
      lineGroupUrlDisclaimer:
        "⚠️ This link cannot be changed after the event is created.",
      namePlaceholder: "e.g. Team Dinner",
      descriptionPlaceholder: "Tell guests what to expect…",
      limitPlaceholder: "e.g. 20",
      linePlaceholder: "https://line.me/R/ti/g/...",
      submitButton: "Create Event",
      submittingButton: "Creating…",
      networkError: "Network error. Please try again.",
      success: {
        title: "Event Created!",
        subtitle: "Share this link or QR code with your guests.",
        eventUrlLabel: "Event URL",
        copyButton: "Copy",
        openButton: "Open Event Page →",
        qrLabel: "QR Code",
        qrHint: "Guests scan this to reach the RSVP page",
        createAnother: "Create Another Event",
      },
    },
    event: {
      loading: "Loading event…",
      backHome: "← Back to home",
      spotsFilled: "spots filled",
      attending: "attending",
      eventFull: "— Event is full",
      eventFullAlert: "Event is full.",
      noMoreSpots: "No more spots available.",
      rsvpTitle: "RSVP",
      yourName: "Your Name",
      namePlaceholder: "Enter your name",
      submitButton: "RSVP Now",
      submittingButton: "Submitting…",
      success: {
        title: "You're going!",
        successFor: "You've successfully RSVPed for",
        joinLine: "💬 Join the LINE Group",
      },
      errors: {
        eventFull: "Sorry, this event is now full.",
        networkError: "Network error. Please try again.",
        failedRsvp: "Failed to RSVP. Please try again.",
        failedLoad: "Failed to load event",
      },
      participants: {
        title: "Attendees",
        empty: "No one has RSVPed yet — be the first!",
      },
    },
  },
  ja: {
    langToggle: "English",
    nav: {
      brand: "tomotomo",
    },
    home: {
      tagline:
        "イベントを作成し、QRコードをシェアして、参加登録を集めましょう。LINEグループのリンクは参加登録後に公開されます。",
      createButton: "イベントを作成",
      howItWorks: "使い方",
      steps: [
        "イベントの詳細とLINEグループのリンクを入力",
        "ゲストにQRコードをシェア",
        "ゲストがコードをスキャンして名前を入力して参加登録",
        "参加登録後にLINEグループの参加リンクが表示される",
      ],
    },
    create: {
      title: "イベントを作成",
      eventName: "イベント名",
      description: "説明",
      participantLimit: "参加者の上限",
      participantLimitHint: "空欄にすると無制限",
      lineGroupUrl: "LINEグループ招待URL",
      lineGroupUrlHint: "任意 — 参加登録後に表示",
      lineGroupUrlDisclaimer:
        "⚠️ このリンクはイベント作成後に変更できません。",
      namePlaceholder: "例: チームディナー",
      descriptionPlaceholder: "ゲストに伝えたいことを書いてください…",
      limitPlaceholder: "例: 20",
      linePlaceholder: "https://line.me/R/ti/g/...",
      submitButton: "イベントを作成",
      submittingButton: "作成中…",
      networkError: "ネットワークエラーが発生しました。再試行してください。",
      success: {
        title: "イベントが作成されました！",
        subtitle:
          "このリンクまたはQRコードをゲストにシェアしてください。",
        eventUrlLabel: "イベントURL",
        copyButton: "コピー",
        openButton: "イベントページを開く →",
        qrLabel: "QRコード",
        qrHint: "ゲストがスキャンしてRSVPページにアクセスできます",
        createAnother: "別のイベントを作成",
      },
    },
    event: {
      loading: "イベントを読み込み中…",
      backHome: "← ホームに戻る",
      spotsFilled: "人が参加済み",
      attending: "人が参加",
      eventFull: "— 満員です",
      eventFullAlert: "このイベントは満員です。",
      noMoreSpots: "空き枠はありません。",
      rsvpTitle: "参加登録",
      yourName: "お名前",
      namePlaceholder: "お名前を入力してください",
      submitButton: "参加登録する",
      submittingButton: "送信中…",
      success: {
        title: "参加登録完了！",
        successFor: "への参加登録が完了しました。",
        joinLine: "💬 LINEグループに参加",
      },
      errors: {
        eventFull:
          "申し訳ありません。このイベントは満員になりました。",
        networkError:
          "ネットワークエラーが発生しました。再試行してください。",
        failedRsvp: "参加登録に失敗しました。再試行してください。",
        failedLoad: "イベントの読み込みに失敗しました",
      },
      participants: {
        title: "参加者",
        empty: "まだ参加登録者がいません — 最初に登録しましょう！",
      },
    },
  },
} as const;
