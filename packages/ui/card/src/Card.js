"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Card = void 0;
require("./Card.css");
var Card = /** @class */ (function () {
    function Card(props) {
        if (props === void 0) { props = {}; }
        this.props = props;
    }
    Card.prototype.render = function () {
        var el = document.createElement("article");
        el.className = "hds-card";
        if (this.props.elevated) {
            el.classList.add("hds-card--elevated");
        }
        el.innerHTML = "\n      ".concat(this.props.title ? "<h3>".concat(this.props.title, "</h3>") : "", "\n      ").concat(this.props.content ? "<p>".concat(this.props.content, "</p>") : "", "\n    ");
        return el;
    };
    return Card;
}());
exports.Card = Card;
