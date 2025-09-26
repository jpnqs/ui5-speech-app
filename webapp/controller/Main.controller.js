sap.ui.define(
  [
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "speech/app/util/SpeechStream",
  ],
  function (Controller, MessageToast, SpeechStream) {
    "use strict";

    return Controller.extend("speech.app.controller.Main", {
      onInit: function () {
        this._speech = null;
        this._timerId = null;
      },

      _resetSilenceTimer: function () {
        const oModel = this.getOwnerComponent().getModel("vm");
        const ms = oModel.getProperty("/silenceMs") || 1500;
        if (this._timerId) clearTimeout(this._timerId);
        this._timerId = setTimeout(this._commitToList.bind(this), ms);
      },

      // Beim Commit nach Stille:
      _commitToList: function () {
        const oModel = this.getOwnerComponent().getModel("vm");
        // Nimm committed + evtl. noch verbleibenden Interim-Buffer
        const committed = oModel.getProperty("/_committed") || "";
        const text = (
          committed +
          (this._interimBuf ? (committed ? " " : "") + this._interimBuf : "")
        ).trim();
        if (!text) return;

        const items = oModel.getProperty("/items") || [];
        oModel.setProperty("/items", [...items, { text }]);

        // zurücksetzen
        oModel.setProperty("/inputText", "");
        oModel.setProperty("/_committed", "");
        this._interimBuf = "";
      },

      onCommit: function () {
        this._commitToList();
      },
      onClear: function () {
        this.getOwnerComponent().getModel("vm").setProperty("/items", []);
      },
      onManualEdit: function () {
        this._resetSilenceTimer();
      },

      onStart: async function () {
        if (!this._speech) {
          this._speech = new SpeechStream({
            lang: "en-US",
            interimResults: true,
            continuous: true,
            maxAlternatives: 1,
          });

          this._speech.addEventListener("partial", (e) => {
            const oModel = this.getOwnerComponent().getModel("vm");
            const committed = oModel.getProperty("/_committed") || "";
            const interim = e.detail.text || "";
            const value =
              committed && interim
                ? committed + " " + interim
                : committed || interim;
            oModel.setProperty("/inputText", value);
            this._resetSilenceTimer();
          });

          this._speech.addEventListener("final", (e) => {
            const oModel = this.getOwnerComponent().getModel("vm");
            const committed = oModel.getProperty("/_committed") || "";
            const t = e.detail.text || "";
            const newCommitted = committed ? committed + " " + t : t;
            oModel.setProperty("/_committed", newCommitted);
            oModel.setProperty("/inputText", newCommitted);
            this._resetSilenceTimer();
          });

          this._speech.addEventListener("error", (e) => {
            MessageToast.show("Speech error: " + (e.detail?.error || e.type));
          });
        }

        try {
          await this._speech.start();
          MessageToast.show("🎤 Zuhören gestartet");
        } catch (err) {
          MessageToast.show(err.message || String(err));
        }
      },

      onStop: function () {
        if (this._speech) {
          this._speech.stop();
          const oModel = this.getOwnerComponent().getModel("vm");
          oModel.setProperty("/_committed", "");
          oModel.setProperty("/inputText", "");
          if (this._timerId) clearTimeout(this._timerId);
          MessageToast.show("⏹️ Zuhören gestoppt");
        }
      },
    });
  }
);
