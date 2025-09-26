sap.ui.define(
  ["sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel"],
  function (UIComponent, JSONModel) {
    "use strict";

    return UIComponent.extend("speech.app.Component", {
      metadata: { manifest: "json" },
      init: function () {
        UIComponent.prototype.init.apply(this, arguments);

        // ViewModel
        const oModel = new JSONModel({
          inputText: "",
          items: [],
          silenceMs: 1500,
          _committed: "",
        });
        this.setModel(oModel, "vm");
      },
    });
  }
);
