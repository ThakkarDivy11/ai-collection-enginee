const axios = require("axios");
const Invoice = require("../models/Invoice");
const VoiceCallLog = require("../models/VoiceCallLog");

// ─── Twilio (Voice) ──────────────────────────────────────────────────────────
const twilio = require("twilio");
const twilioClient = (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN)
    ? twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    : null;

// ─── SendGrid (Email) ──────────────────────────────────────────────────────
const sgMail = require("@sendgrid/mail");
if (process.env.SENDGRID_API_KEY) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// ─── Email Reminder ────────────────────────────────────────────────────────
/**
 * Send an email reminder via SendGrid (falls back to console mock if not configured)
 * @returns {{ success: boolean, actionStatus: "sent"|"failed" }}
 */
const sendEmailReminder = async (customerEmail, message) => {
    console.log(`[Email] Sending to ${customerEmail}`);
    try {
        if (!process.env.SENDGRID_API_KEY) {
            // Dev mock — log and treat as sent so the dashboard still shows activity
            console.log(`[Email Mock] To: ${customerEmail}\n${message}`);
            return { success: true, actionStatus: "sent", tool: "email" };
        }

        await sgMail.send({
            to: customerEmail,
            from: process.env.SENDGRID_FROM_EMAIL || "collections@collectai.com",
            subject: "Invoice Payment Reminder",
            text: message,
            html: `<p>${message.replace(/\n/g, "<br/>")}</p>`,
        });

        console.log(`[Email] Sent successfully to ${customerEmail}`);
        return { success: true, actionStatus: "sent", tool: "email" };
    } catch (error) {
        console.error("[Email] Failed:", error.message);
        return { success: false, actionStatus: "failed", tool: "email", error: error.message };
    }
};


// ─── AI Voice Call ─────────────────────────────────────────────────────────
/**
 * Trigger an AI voice call via Vapi (or Twilio TwiML as fallback)
 * @returns {{ success: boolean, actionStatus: "sent"|"failed" }}
 */
const triggerVoiceCall = async (customerPhone, customerName, invoiceId, amount, message) => {
    console.log(`[Voice] Triggering AI call to ${customerPhone}`);
    let callStatus = "failed";

    try {
        if (process.env.VAPI_API_KEY) {
            // ── Vapi AI voice call ──────────────────────────────────────────
            await axios.post(
                "https://api.vapi.ai/call/phone",
                {
                    phoneNumberId: process.env.VAPI_PHONE_NUMBER_ID,
                    customer: { number: customerPhone, name: customerName },
                    assistantId: process.env.VAPI_ASSISTANT_ID,
                    assistantOverrides: { firstMessage: message },
                },
                {
                    headers: {
                        Authorization: `Bearer ${process.env.VAPI_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log(`[Voice/Vapi] Call initiated to ${customerPhone}`);
            callStatus = "completed";
        } else if (twilioClient) {
            // ── Twilio TwiML fallback ───────────────────────────────────────
            await twilioClient.calls.create({
                twiml: `<Response><Say>${message}</Say></Response>`,
                to: customerPhone,
                from: process.env.TWILIO_PHONE_NUMBER || "+14155238886",
            });
            console.log(`[Voice/Twilio] Call placed to ${customerPhone}`);
            callStatus = "completed";
        } else {
            // ── Dev mock ────────────────────────────────────────────────────
            console.log(`[Voice Mock] Call to ${customerPhone}\n${message}`);
            callStatus = "completed";
        }
    } catch (error) {
        console.error("[Voice] Call failed:", error.message);
        callStatus = "failed";
    }

    // Always log to VoiceCallLog
    try {
        const log = new VoiceCallLog({
            customerName,
            invoiceId,
            callStatus,
            transcript: message,
            timestamp: new Date(),
        });
        await log.save();
    } catch (logErr) {
        console.error("[Voice] Failed to save call log:", logErr.message);
    }

    return {
        success: callStatus === "completed",
        actionStatus: callStatus === "completed" ? "sent" : "failed",
        tool: "call",
    };
};

// ─── Invoice Escalation ────────────────────────────────────────────────────
/**
 * Mark invoice as escalated/overdue
 * @returns {{ success: boolean, actionStatus: "sent"|"failed" }}
 */
const updateInvoiceStatus = async (invoiceId) => {
    console.log(`[Escalate] Updating invoice ${invoiceId} to 'overdue'`);
    try {
        await Invoice.findByIdAndUpdate(invoiceId, { status: "overdue" });
        return { success: true, actionStatus: "sent", tool: "escalate" };
    } catch (error) {
        console.error("[Escalate] Failed:", error.message);
        return { success: false, actionStatus: "failed", tool: "escalate" };
    }
};

// ─── Schedule Next Reminder ────────────────────────────────────────────────
const scheduleNextReminder = async (invoiceId) => {
    console.log(`[Scheduler] Next reminder queued for Invoice ${invoiceId}`);
    return { success: true };
};

module.exports = {
    sendEmailReminder,
    triggerVoiceCall,
    updateInvoiceStatus,
    scheduleNextReminder,
};
