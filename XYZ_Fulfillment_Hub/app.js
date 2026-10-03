const state = {
  orders: [
    {id:"ORD-1048", customer:"Aarav Mehta", channel:"Shopify", items:"Wireless Mouse · Black", stage:"Priority", promise:"Today · 14:30", risk:"High", riskClass:"red", location:"Main / A-14", courier:"Delhivery", events:["09:12 — Order received","09:18 — Payment verified","09:31 — Marked priority","Waiting — Picking"]},
    {id:"ORD-1047", customer:"Riya Shah", channel:"Amazon", items:"Keyboard · Compact", stage:"Picking", promise:"Today · 16:00", risk:"Watch", riskClass:"amber", location:"Main / B-03", courier:"Blue Dart", events:["08:45 — Order received","09:02 — Label created","10:04 — Picker assigned","10:17 — Picking"]},
    {id:"ORD-1046", customer:"Kunal Rao", channel:"Wholesale", items:"USB-C Hub × 4", stage:"Packing", promise:"Today · 17:30", risk:"Low", riskClass:"green", location:"Main / C-11", courier:"Ecom Express", events:["08:10 — Order received","08:24 — Picked","09:11 — Packing started"]},
    {id:"ORD-1045", customer:"Ananya Iyer", channel:"Shopify", items:"Laptop Stand · Silver", stage:"Delayed", promise:"Missed · 11:00", risk:"High", riskClass:"red", location:"Overflow / O-07", courier:"Delhivery", events:["07:52 — Order received","08:10 — Label created","09:05 — Stock mismatch","11:00 — Promise missed"]},
    {id:"ORD-1044", customer:"Vikram Singh", channel:"Amazon", items:"HDMI Cable × 2", stage:"Staging", promise:"Today · 13:45", risk:"Watch", riskClass:"amber", location:"Stage S-04", courier:"Blue Dart", events:["07:35 — Order received","08:02 — Picked","08:20 — Packed","08:32 — Moved to S-04"]},
    {id:"ORD-1043", customer:"Neha Kapoor", channel:"Shopify", items:"Webcam · 1080p", stage:"Shipped", promise:"Completed", risk:"Low", riskClass:"green", location:"Courier Bay 1", courier:"Delhivery", events:["Yesterday 16:20 — Order received","16:48 — Packed","17:02 — Staged","17:25 — Courier collected"]}
  ],
  inventory: [
    {sku:"WM-BLK-01", name:"Wireless Mouse · Black", onHand:18, available:8, reserved:10, expected:40, location:"Main A-14", status:"healthy", note:"Enough for priority queue"},
    {sku:"LS-SIL-02", name:"Laptop Stand · Silver", onHand:5, available:0, reserved:5, expected:20, location:"Overflow O-07", status:"critical", note:"Main shelf shows 0; transfer needed"},
    {sku:"KB-CMP-03", name:"Keyboard · Compact", onHand:23, available:6, reserved:17, expected:30, location:"Main B-03", status:"watch", note:"Low available stock"},
    {sku:"HUB-USC-04", name:"USB-C Hub", onHand:31, available:19, reserved:12, expected:0, location:"Main C-11", status:"healthy", note:"Stable"},
    {sku:"HDMI-2M-05", name:"HDMI Cable · 2m", onHand:47, available:39, reserved:8, expected:0, location:"Main D-05", status:"healthy", note:"Stable"},
    {sku:"CAM-1080-06", name:"Webcam · 1080p", onHand:11, available:8, reserved:3, expected:12, location:"Main E-02", status:"healthy", note:"Replenishment incoming"}
  ],
  exceptions: [
    {title:"Stock mismatch: Laptop Stand", desc:"System shows stock, but the main warehouse shelf is empty. Order ORD-1045 is blocked.", time:"18 min ago", severity:"critical", action:"Transfer from overflow"},
    {title:"Priority order waiting for pick", desc:"ORD-1048 has a same-day promise and has not been assigned to a picker.", time:"9 min ago", severity:"critical", action:"Assign picker"},
    {title:"Courier pickup approaching", desc:"Blue Dart pickup is scheduled at 14:00. Two packed boxes are still in staging.", time:"26 min ago", severity:"watch", action:"Confirm handoff"},
    {title:"Wrong-variant check", desc:"One order contains a variant that was changed after label creation. Verify before packing.", time:"41 min ago", severity:"watch", action:"Verify SKU"}
  ],
  staging: [
    {name:"Blue Dart", cutoff:"14:00", count:2, boxes:["ORD-1044 · S-04","ORD-1039 · S-02"]},
    {name:"Delhivery", cutoff:"16:30", count:1, boxes:["ORD-1041 · S-01"]},
    {name:"Ecom Express", cutoff:"17:00", count:3, boxes:["ORD-1046 · S-06","ORD-1038 · S-05","ORD-1037 · S-03"]}
  ]
};

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

function statusBadge(text, cls="green"){ return `<span class="badge ${cls}">${text}</span>`; }

function renderDashboard(){
  const priority = state.orders.filter(o => o.risk !== "Low" && o.stage !== "Shipped");
  const delayed = state.orders.filter(o => o.stage === "Delayed").length;
  const staging = state.orders.filter(o => o.stage === "Staging").length;
  const stockIssues = state.inventory.filter(i => i.status !== "healthy").length;

  $("#kpiGrid").innerHTML = [
    ["Open orders", state.orders.filter(o=>o.stage!=="Shipped").length, "Across today's queue", ""],
    ["Priority / at risk", priority.length, "Need attention first", "warn"],
    ["Delayed", delayed, delayed ? "Promise already missed" : "No missed promises", delayed ? "bad":"good"],
    ["Stock risks", stockIssues, "Mismatch or low availability", stockIssues ? "warn":"good"]
  ].map(k => `<div class="kpi"><div class="kpi-top"><span>${k[0]}</span><span>●</span></div><div class="kpi-value">${k[1]}</div><div class="kpi-note ${k[3]}">${k[2]}</div></div>`).join("");

  $("#priorityList").innerHTML = priority.slice(0,4).map(o => `
    <div class="list-row">
      <div class="order-dot">${o.id.slice(-2)}</div>
      <div class="list-main"><strong>${o.id} · ${o.customer}</strong><p>${o.items} · ${o.promise}</p></div>
      ${statusBadge(o.risk, o.riskClass)}
      <button class="table-btn" onclick="openOrder('${o.id}')">Open</button>
    </div>`).join("");

  const health = [
    ["Priority handling", 78, "warn", "2 priority orders need a picker"],
    ["Inventory accuracy", 61, "bad", "Laptop Stand has a shelf mismatch"],
    ["Packing flow", 88, "good", "No major packing backlog"],
    ["Courier readiness", 72, "warn", `${staging} boxes currently staged`]
  ];
  $("#healthList").innerHTML = health.map(h => `<div class="health-item ${h[2]}"><div class="health-line"><span>${h[0]}</span><strong>${h[1]}%</strong></div><div class="bar"><i style="width:${h[1]}%"></i></div><div style="font-size:10px;color:#7d8790;margin-top:5px">${h[3]}</div></div>`).join("");

  const stages = ["Received","Processed","Picking","Packing","Staging","Shipped"];
  $("#flow").innerHTML = stages.map((s,i)=> {
    const count = s==="Received" ? state.orders.length : state.orders.filter(o => (s==="Shipped" ? o.stage==="Shipped" : o.stage===s)).length;
    return `<div class="flow-step"><div class="flow-icon">${i+1}</div><strong>${s}</strong><span>${count} orders</span></div>`;
  }).join("");
}

function renderOrders(){
  const filter = $("#orderStatusFilter").value;
  const query = ($("#globalSearch").value || "").toLowerCase();
  const rows = state.orders.filter(o => (filter==="all" || o.stage===filter) &&
    [o.id,o.customer,o.channel,o.items,o.stage].join(" ").toLowerCase().includes(query));
  $("#ordersTable").innerHTML = rows.map(o=>`
    <tr>
      <td><strong>${o.id}</strong></td>
      <td>${o.customer}</td><td>${o.channel}</td><td>${o.items}</td>
      <td>${statusBadge(o.stage, o.stage==="Delayed"?"red":o.stage==="Priority"?"amber":o.stage==="Shipped"?"blue":"green")}</td>
      <td>${o.promise}</td><td>${statusBadge(o.risk,o.riskClass)}</td>
      <td><button class="table-btn" onclick="openOrder('${o.id}')">View</button></td>
    </tr>`).join("") || `<tr><td colspan="8" style="padding:25px;text-align:center;color:#7d8790">No matching orders.</td></tr>`;
}

function renderInventory(){
  $("#inventoryCards").innerHTML = state.inventory.map(i=>{
    const ratio = Math.min(100, Math.round((i.available / Math.max(i.onHand,1))*100));
    const label = i.status==="critical" ? "Critical" : i.status==="watch" ? "Watch" : "Healthy";
    const cls = i.status==="critical" ? "red" : i.status==="watch" ? "amber" : "green";
    return `<article class="inventory-card ${i.status}">
      <div class="inv-head"><div><strong>${i.name}</strong><div class="sku">${i.sku}</div></div>${statusBadge(label,cls)}</div>
      <div class="stock-numbers">
        <div><strong>${i.onHand}</strong><span>On hand</span></div>
        <div><strong>${i.available}</strong><span>Available</span></div>
        <div><strong>${i.reserved}</strong><span>Reserved</span></div>
      </div>
      <div class="inv-progress"><i style="width:${ratio}%"></i></div>
      <div class="inv-foot"><span>${i.location}</span><span>Inbound: ${i.expected}</span></div>
      <p style="font-size:10px;color:#7d8790;margin-top:10px">${i.note}</p>
    </article>`;
  }).join("");
}

function renderExceptions(){
  $("#exceptionList").innerHTML = state.exceptions.map((e,idx)=>`
    <article class="exception ${e.severity==="watch"?"watch":""}">
      <div class="exception-icon">${e.severity==="critical"?"!":"~"}</div>
      <div><strong>${e.title}</strong><p>${e.desc}</p><small>${e.time} · Suggested action: ${e.action}</small></div>
      ${statusBadge(e.severity==="critical"?"Needs action":"Watch", e.severity==="critical"?"red":"amber")}
    </article>`).join("");
}

function renderStaging(){
  $("#stagingGrid").innerHTML = state.staging.map(s=>`
    <article class="stage-column">
      <div class="stage-head"><strong>${s.name}</strong><span>Cut-off ${s.cutoff} · ${s.count} boxes</span></div>
      ${s.boxes.map(b=>`<div class="stage-card"><strong>${b}</strong><p>Scan location before courier handoff.</p></div>`).join("")}
    </article>`).join("");
}

function openOrder(id){
  const o = state.orders.find(x=>x.id===id);
  if(!o) return;
  $("#modalBody").innerHTML = `
    <div class="eyebrow">ORDER DETAIL</div>
    <h2 style="margin-top:5px">${o.id}</h2>
    <p class="subcopy">${o.customer} · ${o.channel}</p>
    <div class="detail-grid">
      <div class="detail-box"><span>Current stage</span><strong>${o.stage}</strong></div>
      <div class="detail-box"><span>Promise</span><strong>${o.promise}</strong></div>
      <div class="detail-box"><span>Item</span><strong>${o.items}</strong></div>
      <div class="detail-box"><span>Pick location</span><strong>${o.location}</strong></div>
      <div class="detail-box"><span>Courier</span><strong>${o.courier}</strong></div>
      <div class="detail-box"><span>Risk</span><strong>${o.risk}</strong></div>
    </div>
    <h3>Order trail</h3>
    <div class="timeline">${o.events.map(e=>`<div class="timeline-item"><strong>${e.split(" — ")[0]}</strong><p>${e.split(" — ").slice(1).join(" — ")}</p></div>`).join("")}</div>
    <button class="primary" onclick="closeModal()">Close</button>`;
  $("#modal").classList.remove("hidden");
}

function openIssueForm(){
  $("#modalBody").innerHTML = `
    <div class="eyebrow">QUICK LOG</div>
    <h2 style="margin-top:5px">Log an operational issue</h2>
    <p class="subcopy">Capture the problem now so it does not disappear into a chat or spreadsheet.</p>
    <form class="issue-form" id="issueForm">
      <label>Issue type<select id="issueType"><option>Stock mismatch</option><option>Priority order delay</option><option>Courier pickup</option><option>Wrong variant check</option></select></label>
      <label>Order / SKU<input id="issueRef" placeholder="e.g. ORD-1049 or SKU"></label>
      <label>What happened<textarea id="issueDesc" placeholder="Short description..."></textarea></label>
      <button class="primary" type="submit">Save issue</button>
    </form>`;
  $("#modal").classList.remove("hidden");
  $("#issueForm").addEventListener("submit", e=>{
    e.preventDefault();
    state.exceptions.unshift({
      title: $("#issueType").value,
      desc: `${$("#issueDesc").value || "New issue logged."}${$("#issueRef").value ? " Reference: "+$("#issueRef").value+"." : ""}`,
      time:"Just now", severity:"watch", action:"Review and assign"
    });
    renderExceptions(); closeModal(); navigate("exceptions");
  });
}

function closeModal(){ $("#modal").classList.add("hidden"); }

function navigate(view){
  $$(".nav-item").forEach(b=>b.classList.toggle("active", b.dataset.view===view));
  $$(".view").forEach(v=>v.classList.toggle("active", v.id===`view-${view}`));
  const titles={dashboard:"Fulfillment overview",orders:"Orders",inventory:"Inventory",exceptions:"Exceptions",staging:"Staging & courier"};
  $("#pageTitle").textContent=titles[view] || "Fulfillment overview";
  window.scrollTo({top:0,behavior:"smooth"});
}

$$(".nav-item").forEach(btn=>btn.addEventListener("click",()=>navigate(btn.dataset.view)));
$$("[data-view-jump]").forEach(btn=>btn.addEventListener("click",()=>navigate(btn.dataset.viewJump)));
$("#orderStatusFilter").addEventListener("change",renderOrders);
$("#globalSearch").addEventListener("input",()=>{renderOrders(); if(!$("#view-orders").classList.contains("active")) navigate("orders");});
$("#modalClose").addEventListener("click",closeModal);
$("#modal").addEventListener("click",e=>{if(e.target.id==="modal")closeModal()});
$("#newIssueBtn").addEventListener("click",openIssueForm);
$("#newIssueBtn2").addEventListener("click",openIssueForm);

renderDashboard(); renderOrders(); renderInventory(); renderExceptions(); renderStaging();
window.openOrder=openOrder; window.closeModal=closeModal;
