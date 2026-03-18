import { Injectable, Logger } from '@nestjs/common';

// import * as nodemailer from 'nodemailer';
// const transporter = nodemailer.createTransport({
//   host:   process.env.SMTP_HOST,
//   port:   Number(process.env.SMTP_PORT) || 587,
//   secure: process.env.SMTP_SECURE === 'true',
//   auth:   { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
// });

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);

  async sendRfqInvite(to: string, supplierName: string, rfqTitle: string, rfqNumber: string, portalUrl: string) {
    this.logger.log(`[EMAIL] RFQ invite → ${to}: ${rfqNumber}`);
    // TODO: send via nodemailer
    // await transporter.sendMail({
    //   from:    process.env.EMAIL_FROM,
    //   to,
    //   subject: `You've been invited to bid: ${rfqTitle} [${rfqNumber}]`,
    //   html:    this.rfqInviteTemplate(supplierName, rfqTitle, portalUrl),
    // });
  }

  async sendBidReceived(to: string, buyerName: string, rfqTitle: string, supplierName: string) {
    this.logger.log(`[EMAIL] Bid received → ${to}: ${rfqTitle}`);
  }

  async sendOrderApproved(to: string, orderNumber: string, totalAmount: string) {
    this.logger.log(`[EMAIL] Order approved → ${to}: ${orderNumber}`);
  }

  async sendWelcomeSupplier(to: string, supplierName: string, portalUrl: string, tempPassword: string) {
    this.logger.log(`[EMAIL] Welcome supplier → ${to}`);
  }

  private rfqInviteTemplate(supplierName: string, rfqTitle: string, portalUrl: string): string {
    return `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
        <div style="background:#1e3a5f;padding:24px;border-radius:12px 12px 0 0;">
          <h1 style="color:#fff;margin:0;font-size:22px;">BidFlow</h1>
        </div>
        <div style="padding:32px;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 12px 12px;">
          <p>Hello <strong>${supplierName}</strong>,</p>
          <p>You've been invited to submit a bid for:</p>
          <div style="background:#f8fafc;border-left:4px solid #1e3a5f;padding:16px;border-radius:4px;margin:20px 0;">
            <h2 style="margin:0 0 4px;color:#1e3a5f;">${rfqTitle}</h2>
          </div>
          <a href="${portalUrl}" style="display:inline-block;background:#1e3a5f;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;">
            View RFQ & Submit Bid →
          </a>
        </div>
      </div>
    `;
  }
}
