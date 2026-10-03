# 5-Minute Video Walkthrough

## 0:00–0:35 — Problem

"XYZ is currently managing fulfillment through spreadsheets and shared folders. From the brief, the biggest problems I identified are lack of order visibility, missed priority deadlines, inventory mismatches, wrong-item risk, and boxes or courier pickups getting missed. I decided to build a lightweight operations hub rather than a complicated warehouse-management system."

## 0:35–1:25 — Overview

"This is the FulfillFlow overview. The first thing a manager sees is the open-order count, priority or at-risk orders, delayed orders and stock risks. Below that is the priority queue, so the team can immediately see what needs attention. The operational-health section shows where the process is getting stuck, and the flow at the bottom gives a simple received-to-shipped view."

## 1:25–2:20 — Orders

"I'll open Orders. Each row shows the customer, sales channel, item, stage, promise time and risk. I can filter by status and search by order, customer or SKU. If I open an order, I get its current location, courier and a simple event trail. This directly addresses the original problem of not being able to see order status at a glance."

## 2:20–3:05 — Inventory

"Next is Inventory. The important information here is not just total stock. I show on-hand, available and reserved quantities, plus the physical location. The Laptop Stand is intentionally a critical example: the system has stock information but the main shelf is empty, so the application makes the mismatch visible before the picker wastes time."

## 3:05–3:50 — Exceptions

"Exceptions turns informal problems into visible work. Instead of remembering an issue from a message or conversation, the team can see what happened, how urgent it is and the suggested next action. I can also log a new issue from the button."

## 3:50–4:30 — Staging

"Finally, Staging groups packed boxes by courier and pickup cut-off. This reduces the chance that a packed box is misplaced or that a courier pickup is missed."

## 4:30–5:00 — Why this design

"My main design decision was to optimise for clarity and execution. The warehouse team is experienced but not very comfortable with technology, so I avoided unnecessary complexity. The application focuses on priority, stock accuracy, exceptions and handoff visibility. The sample data is deliberately realistic enough to demonstrate those decisions without pretending to have live integrations."
