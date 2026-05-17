"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadSource = exports.LeadStatus = void 0;
var LeadStatus;
(function (LeadStatus) {
    LeadStatus["NEW"] = "New";
    LeadStatus["CONTACTED"] = "Contacted";
    LeadStatus["QUALIFIED"] = "Qualified";
    LeadStatus["PROPOSAL"] = "Proposal";
    LeadStatus["WON"] = "Won";
    LeadStatus["LOST"] = "Lost";
})(LeadStatus || (exports.LeadStatus = LeadStatus = {}));
var LeadSource;
(function (LeadSource) {
    LeadSource["WEBSITE"] = "Website";
    LeadSource["REFERRAL"] = "Referral";
    LeadSource["LINKEDIN"] = "LinkedIn";
    LeadSource["COLD_CALL"] = "Cold Call";
    LeadSource["ADVERTISEMENT"] = "Advertisement";
    LeadSource["OTHER"] = "Other";
})(LeadSource || (exports.LeadSource = LeadSource = {}));
//# sourceMappingURL=lead.types.js.map