# Google Sheet Structure for Padel & Palms Form Submissions

## Overview
This document describes all fields that will be sent from the form submission and how they should be captured in a Google Sheet.

## Main Contact Information Fields

| Column Name | Data Type | Description | Example |
|------------|-----------|-------------|---------|
| Submission Date/Time | DateTime | ISO 8601 format timestamp | 2025-11-30T14:30:00.000Z |
| Email | Text | Customer email address | john@example.com |
| Phone | Text | Customer phone number | +1 (555) 123-4567 |
| Currency | Text | Currency code used for pricing | USD, EUR, GBP |
| Total Monthly | Number | Total recurring monthly charges | 299.00 |
| Total One-Time | Number | Total one-time fees (website + setup fees) | 3000.00 |

## Service Selection Fields

### Website Service
| Column Name | Data Type | Description |
|------------|-----------|-------------|
| Website - Selected | Boolean/Checkbox | Whether "Custom Website Build" was selected |
| Website - Notes | Text (Long) | Custom notes for website requirements |
| Website - Price | Number | Always $2500 (one-time) |

### Booking Automation Bundle
| Column Name | Data Type | Description |
|------------|-----------|-------------|
| Booking - Villa Bookings | Boolean/Checkbox | Villa booking automation selected |
| Booking - Villa Notes | Text (Long) | Notes for villa booking requirements |
| Booking - Villa Price | Number | $299/month |
| Booking - Court Bookings | Boolean/Checkbox | Court booking automation selected |
| Booking - Court Notes | Text (Long) | Notes for court booking requirements |
| Booking - Court Price | Number | $149/month |

### Notifications Setup Bundle (Dynamic Pricing)
| Column Name | Data Type | Description |
|------------|-----------|-------------|
| Notifications - Flow 1 Selected | Boolean/Checkbox | Pre-Arrival Engagement flow |
| Notifications - Flow 1 Notes | Text (Long) | Custom requirements for flow 1 |
| Notifications - Flow 1 Price | Number | $88.50 (1 selected), $75 (2 selected), or $62 (3 selected) |
| Notifications - Flow 2 Selected | Boolean/Checkbox | Post-Game F&B Upsell flow |
| Notifications - Flow 2 Notes | Text (Long) | Custom requirements for flow 2 |
| Notifications - Flow 2 Price | Number | $88.50 (1 selected), $75 (2 selected), or $62 (3 selected) |
| Notifications - Flow 3 Selected | Boolean/Checkbox | Custom flow |
| Notifications - Flow 3 Notes | Text (Long) | Custom requirements for flow 3 |
| Notifications - Flow 3 Price | Number | $88.50 (1 selected), $75 (2 selected), or $62 (3 selected) |
| Notifications - Count Selected | Number | How many notification flows were selected (for pricing) |

### AI Receptionist Bundle (Dynamic Pricing)
| Column Name | Data Type | Description |
|------------|-----------|-------------|
| AI - Text Chat Selected | Boolean/Checkbox | 24/7 text chat support |
| AI - Text Chat Notes | Text (Long) | Requirements for text chat |
| AI - Text Chat Price | Number | $59 (1 selected), $50 (2 selected), or $41 (3 selected) |
| AI - Voice Calls Selected | Boolean/Checkbox | Voice call support |
| AI - Voice Calls Notes | Text (Long) | Requirements for voice support |
| AI - Voice Calls Price | Number | $177 (1 selected), $150 (2 selected), or $124 (3 selected) |
| AI - Email Support Selected | Boolean/Checkbox | Email support |
| AI - Email Support Notes | Text (Long) | Requirements for email support |
| AI - Email Support Price | Number | $177 (1 selected), $150 (2 selected), or $124 (3 selected) |
| AI - Count Selected | Number | How many AI options were selected (for pricing) |

### Additional Services
| Column Name | Data Type | Description |
|------------|-----------|-------------|
| Content Engine Selected | Boolean/Checkbox | Brand Content Engine (40 posts/week) |
| Content Engine Notes | Text (Long) | Content requirements and preferences |
| Content Engine Price | Number | $159/month |
| Dashboard Selected | Boolean/Checkbox | Daily Pulse Dashboard |
| Dashboard Notes | Text (Long) | Dashboard requirements |
| Dashboard Monthly Price | Number | $212/month |
| Dashboard Setup Fee | Number | $500 (one-time, if dashboard selected) |

## JSON Data Fields (Advanced)

If you want to store the raw JSON data for reference:

| Column Name | Data Type | Description |
|------------|-----------|-------------|
| Selected Services JSON | Text (Long) | Full array of selected services with details |
| Service Notes JSON | Text (Long) | Full object of all service notes keyed by service ID |
| Raw Payload JSON | Text (Long) | Complete payload for debugging |

## Data Structure Notes

### Dynamic Pricing Rules
**Notifications Bundle:**
- 1 flow selected: $88.50/month each
- 2 flows selected: $75/month each
- 3 flows selected: $62/month each

**AI Receptionist Bundle:**
- Text Chat: $59 (1 option), $50 (2 options), $41 (3 options)
- Voice & Email: $177 (1 option), $150 (2 options), $124 (3 options)

### Service ID Reference
For the serviceNotes object, these are the possible keys:
- `website` - Custom Website Build
- `booking-villas` - Villa Bookings
- `booking-courts` - Court Bookings
- `notification-1` - Notification Flow 1
- `notification-2` - Notification Flow 2
- `notification-3` - Notification Flow 3
- `ai-chat` - Text Chat
- `ai-voice` - Voice Calls
- `ai-email` - Email Support
- `content` - Brand Content Engine
- `dashboard` - Daily Pulse Dashboard

## Example Payload Structure

```json
{
  "email": "owner@padelclub.com",
  "phone": "+34 123 456 789",
  "selectedServices": [
    {
      "category": "Custom Website Build",
      "description": "Fully branded design • Villa booking pages • ...",
      "notes": "Need integration with existing booking system"
    },
    {
      "category": "Booking Automation & Sync",
      "options": [
        {
          "name": "Villa Bookings",
          "description": "Sync all OTA platforms to your master system automatically",
          "notes": "Using Booking.com and Airbnb"
        },
        {
          "name": "Court Bookings",
          "description": "Real-time Playtomic & website sync. Zero double bookings.",
          "notes": "Already using Playtomic"
        }
      ]
    },
    {
      "category": "AI Receptionist",
      "options": [
        {
          "name": "Text Chat",
          "description": "24/7 intelligent text responses + staff notifications when needed",
          "notes": "Need Spanish and English support"
        }
      ]
    }
  ],
  "serviceNotes": {
    "website": "Need integration with existing booking system",
    "booking-villas": "Using Booking.com and Airbnb",
    "booking-courts": "Already using Playtomic",
    "ai-chat": "Need Spanish and English support"
  },
  "totalMonthly": 507,
  "totalOneTime": 2500,
  "currency": "USD",
  "submittedAt": "2025-11-30T14:30:00.000Z"
}
```

## Recommended Sheet Setup Instructions for Gemini

"Create a Google Sheet with the following specifications:

1. **Sheet Name:** Padel & Palms Form Submissions

2. **Column Headers (in order):**
   - Row 1 should contain all the column names from the tables above

3. **Data Validation:**
   - Boolean/Checkbox columns should use checkbox data validation
   - Number columns should be formatted as numbers with 2 decimal places
   - DateTime column should be formatted as "yyyy-mm-dd hh:mm:ss"
   - Currency should match the Currency field value

4. **Conditional Formatting:**
   - Highlight rows where Total Monthly > $500 in light green
   - Highlight rows where Total One-Time > $2000 in light blue
   - Highlight rows submitted in the last 24 hours in light yellow

5. **Summary Dashboard (create a second sheet):**
   - Total submissions count
   - Average monthly package value
   - Most popular services (count how many times each service was selected)
   - Total revenue potential (sum of all monthly recurring + one-time fees)

6. **Data Organization:**
   - Freeze the header row
   - Apply filters to all columns
   - Sort by Submission Date/Time (newest first) by default"
