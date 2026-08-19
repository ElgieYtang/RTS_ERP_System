/**
 * Figma use_figma script — run via Figma MCP when rate limit resets.
 * File: RBGqMoEJ2KFD2NTrxpr8OK
 *
 * This script:
 * 1. Fixes status badges to perfect pills (cornerRadius = height/2)
 * 2. Wires prototype links for step-by-step navigation
 * 3. Positions screens 03-12 (call buildScreens separately if needed)
 *
 * Usage: paste `code` into use_figma tool with fileKey RBGqMoEJ2KFD2NTrxpr8OK
 */

export const FIGMA_FIX_BADGES_AND_PROTOTYPE = `
const mutatedNodeIds = [];

function hex(c) {
  const h = c.replace('#', '');
  return { r: parseInt(h.slice(0,2),16)/255, g: parseInt(h.slice(2,4),16)/255, b: parseInt(h.slice(4,6),16)/255 };
}

function pillBadge(parent, label, bg, fg) {
  await figma.loadFontAsync({ family: 'Inter', style: 'Semi Bold' });
  const wrap = figma.createAutoLayout('HORIZONTAL');
  wrap.name = 'status-badge';
  wrap.fills = [{ type: 'SOLID', color: hex(bg) }];
  wrap.paddingLeft = 12; wrap.paddingRight = 12; wrap.paddingTop = 5; wrap.paddingBottom = 5;
  wrap.primaryAxisAlignItems = 'CENTER'; wrap.counterAxisAlignItems = 'CENTER';
  const t = figma.createText();
  t.characters = label;
  t.fontSize = 11;
  t.fills = [{ type: 'SOLID', color: hex(fg) }];
  t.textAutoResize = 'WIDTH_AND_HEIGHT';
  wrap.appendChild(t);
  wrap.layoutSizingHorizontal = 'HUG';
  wrap.layoutSizingVertical = 'HUG';
  wrap.cornerRadius = wrap.height / 2;
  parent.appendChild(wrap);
  mutatedNodeIds.push(wrap.id);
  return wrap;
}

// Fix all existing badge-like frames on dashboard + drawer
const page = figma.currentPage;
const badges = page.findAll(n => n.name === 'status-badge' || (n.type === 'FRAME' && n.name.toLowerCase().includes('badge')));
for (const b of badges) {
  if ('cornerRadius' in b) {
    b.cornerRadius = b.height / 2;
    mutatedNodeIds.push(b.id);
  }
}

const frames = {
  dashboard: page.findOne(n => n.name === '01 / Dashboard'),
  drawer: page.findOne(n => n.name === '02 / Navigation Drawer'),
  qList: page.findOne(n => n.name === '03 / Quotations List'),
  qDetail: page.findOne(n => n.name === '04 / Quotation Detail'),
  qPreview: page.findOne(n => n.name === '05 / Quotation Preview'),
  poList: page.findOne(n => n.name === '06 / Purchase Orders List'),
  poDetail: page.findOne(n => n.name === '07 / Purchase Order Detail'),
  osList: page.findOne(n => n.name === '08 / Outslips List'),
  osDetail: page.findOne(n => n.name === '09 / Outslip Detail'),
  drList: page.findOne(n => n.name === '10 / Delivery Receipts List'),
  drDetail: page.findOne(n => n.name === '11 / Delivery Receipt Detail'),
  drPreview: page.findOne(n => n.name === '12 / Delivery Receipt Preview'),
};

function link(from, to, transition = 'SLIDE_IN') {
  if (!from || !to) return null;
  from.reactions = [{
    trigger: { type: 'ON_CLICK' },
    action: { type: 'NODE', destinationId: to.id, navigation: 'NAVIGATE', transition: { type: transition, direction: 'LEFT', matchLayers: false } }
  }];
  mutatedNodeIds.push(from.id);
  return from.id;
}

const hamburger = frames.dashboard?.findOne(n => n.name === 'btn-hamburger' || n.name === 'hamburger');
const overlay = frames.drawer?.findOne(n => n.name === 'overlay' || n.name === 'drawer-overlay');
if (hamburger && frames.drawer) link(hamburger, frames.drawer);
if (overlay && frames.dashboard) link(overlay, frames.dashboard);

const quickQ = frames.dashboard?.findOne(n => n.name === 'quick-quotations');
const quickPO = frames.dashboard?.findOne(n => n.name === 'quick-purchase-orders');
const quickOS = frames.dashboard?.findOne(n => n.name === 'quick-outslips');
if (quickQ && frames.qList) link(quickQ, frames.qList);
if (quickPO && frames.poList) link(quickPO, frames.poList);
if (quickOS && frames.osList) link(quickOS, frames.osList);

return { mutatedNodeIds, framesFound: Object.fromEntries(Object.entries(frames).map(([k,v]) => [k, !!v])) };
`;
