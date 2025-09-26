sap.ui.define([], function () {
  "use strict";

  /**
   * Creates a new SpeechStream instance for handling speech recognition.
   * @constructor
   * @param {Object} [opts] - Configuration options for the speech recognition.
   * @param {string} [opts.lang] - The language for speech recognition. Defaults to navigator.language or 'de-DE'.
   * @param {boolean} [opts.interimResults=true] - Whether to return interim results.
   * @param {boolean} [opts.continuous=true] - Whether to continuously recognize speech.
   * @param {number} [opts.maxAlternatives=1] - Maximum number of alternative recognitions.
   * @throws {Error} If Web Speech API (SpeechRecognition) is not supported by the browser.
   * @fires SpeechStream#start - Fired when recognition starts.
   * @fires SpeechStream#end - Fired when recognition ends with reason.
   * @fires SpeechStream#error - Fired when an error occurs during recognition.
   * @fires SpeechStream#result - Fired for all results (both interim and final).
   * @fires SpeechStream#partial - Fired for interim results.
   * @fires SpeechStream#final - Fired for final results.
   */
  const SpeechStream = function (opts) {
    opts = opts || {};
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR)
      throw new Error(
        "Web Speech API (SpeechRecognition) wird nicht unterstützt."
      );

    this._r = new SR();
    this._r.lang = opts.lang || navigator.language || "de-DE";
    this._r.interimResults = opts.interimResults !== false;
    this._r.continuous = opts.continuous !== false;
    this._r.maxAlternatives = opts.maxAlternatives || 1;

    this._running = false;
    this._listeners = {};

    this._r.addEventListener("start", () => this._emit("start"));
    this._r.addEventListener("end", () => {
      this._emit("end", { reason: "ended" });
      if (this._r.continuous) {
        try {
          this._r.start();
          this._running = true;
        } catch (e) {}
      }
    });
    this._r.addEventListener("error", (e) =>
      this._emit("error", { error: e.error || e.message || e })
    );
    this._r.addEventListener("result", (ev) => {
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const res = ev.results[i];
        const alt = res[0];
        const payload = {
          text: (alt.transcript || "").trim(),
          isFinal: res.isFinal,
          confidence: alt.confidence,
          resultIndex: i,
        };
        this._emit("result", payload);
        this._emit(res.isFinal ? "final" : "partial", payload);
      }
    });
  };

  SpeechStream.prototype.addEventListener = function (type, fn) {
    (this._listeners[type] = this._listeners[type] || []).push(fn);
  };
  SpeechStream.prototype.removeEventListener = function (type, fn) {
    const a = this._listeners[type] || [];
    const i = a.indexOf(fn);
    if (i >= 0) a.splice(i, 1);
  };
  SpeechStream.prototype._emit = function (type, detail) {
    const a = this._listeners[type] || [];
    a.forEach((fn) => {
      try {
        fn({ type, detail: detail || {} });
      } catch (e) {}
    });
  };

  SpeechStream.prototype.start = async function () {
    if (this._running) return;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    }
    try {
      this._r.start();
      this._running = true;
    } catch (e) {
      if (!String(e).includes("already")) throw e;
    }
  };
  SpeechStream.prototype.stop = function () {
    try {
      this._r.stop();
    } catch (e) {}
    this._running = false;
  };
  SpeechStream.prototype.abort = function () {
    try {
      this._r.abort();
    } catch (e) {}
    this._running = false;
  };

  return SpeechStream;
});
