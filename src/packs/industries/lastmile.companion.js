// Sales Companion content for last-mile delivery: roles, field expenses, certifications,
// learning modules, knowledge base, pitches and guardrails for the account executive team.

export default {
  companion: {
    roles: { rep: 'Last-mile account executive', manager: 'City commercial manager' },
    expenseCategories: [
      { id: 'mileage', label: 'Mileage between merchant and pickup point site visits', limitClass: 'travel' },
      { id: 'parking', label: 'City parking near pickup points', limitClass: 'travel' },
      { id: 'meals', label: 'Lunch on long site visit days', limitClass: 'meals' },
      { id: 'supplies', label: 'Signage, cable ties and test labels', limitClass: 'other' },
      { id: 'lodging', label: 'Overnight stay for regional merchant visits', limitClass: 'lodging' },
      { id: 'telecom', label: 'Mobile data for scanner and app support', limitClass: 'other' },
    ],
    certifications: [
      { id: 'dangerousgoods', label: 'Restricted and dangerous items in parcels', cycleMonths: 12 },
      { id: 'dataprotect', label: 'Shopper address and personal data handling', cycleMonths: 12 },
      { id: 'pudohandbook', label: 'Pickup point network handbook', cycleMonths: 24 },
      { id: 'citysafety', label: 'City driving and parking safety', cycleMonths: 24 },
      { id: 'claimsbasics', label: 'Lost and damaged parcel claims process', cycleMonths: 12 },
    ],
    learningModules: [
      { id: 'mod1', title: 'Reading a merchant’s parcel data before the site visit', minutes: 20, summary: 'Use packing times, failed attempts by reason and returns to choose the one gap worth the visit.' },
      { id: 'mod2', title: 'Agreeing a later collection time', minutes: 15, summary: 'Match the collection to the packing curve and use a driver loop that already passes the site.' },
      { id: 'mod3', title: 'Walking a merchant through their checkout', minutes: 20, summary: 'Count delivery choices on a phone and show published service levels for pickup point and evening options.' },
      { id: 'mod4', title: 'Fixing address quality at the source', minutes: 15, summary: 'Explain failed first attempts by reason and switch on address lookup in common shop platforms.' },
      { id: 'mod5', title: 'Running a pickup point standards check in ten minutes', minutes: 15, summary: 'Space, expired parcels, scanner sync, signage and hours, with a photo for each fix.' },
      { id: 'mod6', title: 'Setting up label-free returns', minutes: 20, summary: 'Show drop-off codes on a phone and agree consolidated returns collection.' },
      { id: 'mod7', title: 'Booking peak capacity with a merchant', minutes: 20, summary: 'Turn a promotion calendar into daily parcel counts inside the published peak calendar.' },
      { id: 'mod8', title: 'Getting a small shipper onto the shipping app', minutes: 15, summary: 'Install, print a test label and book the next collection before leaving.' },
      { id: 'mod9', title: 'Working with the key merchant manager', minutes: 20, summary: 'When to route a merchant conversation, and what to bring: volume, failed attempts and the open ask.' },
    ],
    knowledge: [
      { id: 'kn1', title: 'A merchant wants a promise of next-morning delivery. What do I say?', text: 'Show the published service level for each delivery service. Explain that delivery days and slots come from the network and you cannot promise one that is not published.' },
      { id: 'kn2', title: 'How do I read the failed-attempt report?', text: 'Group failed first attempts by reason. Address problems and nobody home are the two the merchant can fix: address lookup at checkout and pickup point options.' },
      { id: 'kn3', title: 'Where is the current rate card?', text: 'In the commercial app under rate cards. Always hand over the current version and get a signature on receipt.' },
      { id: 'kn4', title: 'A shipper wants a lost parcel refunded on the spot. What now?', text: 'You cannot settle claims. Help the shipper open a claim with the tracking number, photos and invoice, and tell them where to follow it.' },
      { id: 'kn5', title: 'When is a pickup point over its space limit?', text: 'When parcels held exceed the agreed space in the partner agreement. Clear expired parcels first, then ask the network team to redirect new parcels.' },
      { id: 'kn6', title: 'Who agrees terms outside the rate card?', text: 'Nobody in the field. Requests go to the key merchant manager, who takes them to the pricing desk.' },
      { id: 'kn7', title: 'How do I log an override?', text: 'Pick the closest reason and add one line on what you saw at the site. The reason goes to your manager and helps the ranking learn.' },
      { id: 'kn8', title: 'What should I wear on a fulfillment floor?', text: 'A high-visibility vest and safe footwear, and stay out of marked forklift lanes.' },
      { id: 'kn9', title: 'How is mileage claimed?', text: 'Log start and end mileage for the day in the expense app. Parking near pickup points is claimed separately with a receipt.' },
      { id: 'kn10', title: 'How do I prepare for a key merchant review?', text: 'Bring weekly parcel counts, first-attempt success, returns rate and open requests. Agree the agenda with the key merchant manager first.' },
      { id: 'kn11', title: 'A pickup point scanner will not sync. What do I check?', text: 'Login, mobile data or Wi-Fi, then the app version. Run a test scan and confirm it shows in the network view before leaving.' },
    ],
    pitchTemplates: [
      { id: 'pt1', uses: ['kpi'], text: 'On {kpi}, this site is at {kpiValue} against a network benchmark of {kpiTarget}. Closing that gap means fewer second trips and fewer shopper complaints.' },
      { id: 'pt2', uses: ['offer'], text: '{offer} gives your shoppers another way to get their parcel, at the published service level, without changing how you pack.' },
      { id: 'pt3', uses: ['trend', 'event'], text: 'Your parcel counts are on a {trend} trend. With {event} in {eventDays} days, booking collection capacity now keeps your parcels moving at the peak.' },
    ],
    valueStoryTemplates: [
      { id: 'vs1', title: 'Getting more parcels delivered first time', uses: ['share', 'orderCount'], text: '{name} sends an estimated {share} of its parcels with us. Across {orderCount} recent {orders}, the next step is fewer failed first attempts, through address lookup and pickup point options.' },
      { id: 'vs2', title: 'Adding delivery choices shoppers use', uses: ['offer', 'trend'], text: 'Parcel counts show a {trend} trend. Adding {offer} at checkout gives shoppers who are out during the day a way to collect.' },
      { id: 'vs3', title: 'The parcels still going elsewhere', uses: ['potential', 'share'], text: 'Yearly parcel spend at {name} is estimated at {potential}, with {current} sent with us. The gap of {whitespace} is the conversation for this quarter.' },
    ],
    resourcePlans: [
      { id: 'rp1', name: 'Peak capacity booking round', startWeek: 1, weeks: 4, perWeek: 6 },
      { id: 'rp2', name: 'Pickup point standards sweep', startWeek: 2, weeks: 3, perWeek: 10 },
    ],
    guardrails: [
      { id: 'lm1', text: 'Prices come from the published rate card only. Nobody promises a delivery date, slot or claim outcome that the network has not published.', blocked: ['promise next-morning delivery', 'promise the slot', 'refund on the spot', 'special price just for you', 'waive the surcharge'] },
      { id: 'lm2', text: 'Parcel numbers in this demo are sample data. Nothing here promises fewer failed deliveries or lower costs for a real merchant.', blocked: ['zero failed deliveries', 'halve your returns', 'cheapest carrier', 'never late', 'secret discount'] },
    ],
  },
};
