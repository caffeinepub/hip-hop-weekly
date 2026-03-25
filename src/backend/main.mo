import Map "mo:core/Map";
import Set "mo:core/Set";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Order "mo:core/Order";
import RT "mo:core/Runtime";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Principal "mo:core/Principal";

import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      RT.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      RT.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      RT.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  type Id = Nat;
  var nextId = 0;
  func freshId() : Id {
    nextId += 1;
    nextId;
  };

  // Stripe integration
  var configuration : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    configuration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      RT.trap("Unauthorized: Only admins can perform this action");
    };
    configuration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (configuration) {
      case (null) { RT.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // RundownStory

  type RundownStory = {
    id : Id;
    title : Text;
    summary : Text;
    contentBody : Text;
    author : Text;
    imageUrl : Text;
    publishedAt : Time.Time;
    isPublished : Bool;
  };

  let rundownStories = Map.empty<Id, RundownStory>();

  module RundownStory {
    public func compare(story1 : RundownStory, story2 : RundownStory) : Order.Order {
      Text.compare(story1.title, story2.title);
    };
  };

  public shared ({ caller }) func createRundownStory(story : RundownStory) : async Id {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      RT.trap("Unauthorized: Only admins can create stories");
    };
    let id = freshId();
    let newStory : RundownStory = {
      id;
      title = story.title;
      summary = story.summary;
      contentBody = story.contentBody;
      author = story.author;
      imageUrl = story.imageUrl;
      publishedAt = Time.now();
      isPublished = story.isPublished;
    };
    rundownStories.add(id, newStory);
    id;
  };

  public shared ({ caller }) func updateRundownStory(id : Id, story : RundownStory) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      RT.trap("Unauthorized: Only admins can update stories");
    };

    if (not rundownStories.containsKey(id)) { RT.trap("Story not found") };
    rundownStories.add(id, story);
  };

  public shared ({ caller }) func deleteRundownStory(id : Id) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      RT.trap("Unauthorized: Only admins can delete stories");
    };
    if (not rundownStories.containsKey(id)) { RT.trap("Story not found") };
    rundownStories.remove(id);
  };

  // Public read - no authorization required
  public query func getRundownStory(id : Id) : async RundownStory {
    switch (rundownStories.get(id)) {
      case (null) { RT.trap("Story not found") };
      case (?story) { story };
    };
  };

  // Public read - no authorization required
  public query func getAllRundownStories() : async [RundownStory] {
    rundownStories.values().toArray().sort();
  };

  // Public read - no authorization required
  public query func getPublishedRundownStories() : async [RundownStory] {
    rundownStories.values().toArray().filter(func(story) { story.isPublished }).sort();
  };

  // WatchList

  type SocialLink = {
    platform : Text;
    url : Text;
  };

  type WatchListEntry = {
    id : Id;
    artistName : Text;
    bio : Text;
    imageUrl : Text;
    socialLinks : [SocialLink];
    isActive : Bool;
    updatedAt : Time.Time;
  };

  let watchList = Map.empty<Id, WatchListEntry>();

  var activeWatchListId : ?Id = null;

  module WatchListEntry {
    public func compare(entry1 : WatchListEntry, entry2 : WatchListEntry) : Order.Order {
      Text.compare(entry1.artistName, entry2.artistName);
    };
  };

  public shared ({ caller }) func createWatchListEntry(entry : WatchListEntry) : async Id {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      RT.trap("Unauthorized: Only admins can create watch list entries");
    };
    let id = freshId();
    let newEntry : WatchListEntry = {
      id;
      artistName = entry.artistName;
      bio = entry.bio;
      imageUrl = entry.imageUrl;
      socialLinks = entry.socialLinks;
      isActive = entry.isActive;
      updatedAt = Time.now();
    };
    watchList.add(id, newEntry);
    id;
  };

  public shared ({ caller }) func updateWatchListEntry(id : Id, entry : WatchListEntry) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      RT.trap("Unauthorized: Only admins can update watch list entries");
    };

    if (not watchList.containsKey(id)) { RT.trap("Watch list entry not found") };
    watchList.add(id, entry);
  };

  public shared ({ caller }) func setActiveWatchList(id : Id) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      RT.trap("Unauthorized: Only admins can set active watch list");
    };
    if (not watchList.containsKey(id)) { RT.trap("Watch list entry not found") };
    activeWatchListId := ?id;
  };

  // Public read - no authorization required
  public query func getActiveWatchList() : async WatchListEntry {
    switch (activeWatchListId) {
      case (null) { RT.trap("No active watch list entry found") };
      case (?id) {
        switch (watchList.get(id)) {
          case (null) { RT.trap("Active watch list entry not found") };
          case (?entry) { entry };
        };
      };
    };
  };

  // Public read - no authorization required
  public query func getAllWatchListEntries() : async [WatchListEntry] {
    watchList.values().toArray().sort();
  };

  // RegionEntry

  type RegionEntry = {
    id : Id;
    region : Text;
    subregion : Text;
    country : Text;
    artistName : Text;
    description : Text;
    imageUrl : Text;
    isActive : Bool;
  };

  let regions = Map.empty<Id, RegionEntry>();

  module RegionEntry {
    public func compare(entry1 : RegionEntry, entry2 : RegionEntry) : Order.Order {
      Text.compare(entry1.region, entry2.region);
    };
  };

  public shared ({ caller }) func createRegionEntry(entry : RegionEntry) : async Id {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      RT.trap("Unauthorized: Only admins can create region entries");
    };
    let id = freshId();
    let newEntry : RegionEntry = {
      id;
      region = entry.region;
      subregion = entry.subregion;
      country = entry.country;
      artistName = entry.artistName;
      description = entry.description;
      imageUrl = entry.imageUrl;
      isActive = entry.isActive;
    };
    regions.add(id, newEntry);
    id;
  };

  public shared ({ caller }) func updateRegionEntry(id : Id, entry : RegionEntry) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      RT.trap("Unauthorized: Only admins can update region entries");
    };

    if (not regions.containsKey(id)) { RT.trap("Region entry not found") };
    regions.add(id, entry);
  };

  public shared ({ caller }) func deleteRegionEntry(id : Id) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      RT.trap("Unauthorized: Only admins can delete region entries");
    };

    if (not regions.containsKey(id)) { RT.trap("Region entry not found") };
    regions.remove(id);
  };

  // Public read - no authorization required
  public query func getAllActiveRegionEntries() : async [RegionEntry] {
    regions.values().toArray().filter(func(entry) { entry.isActive }).sort();
  };

  // BeatChart

  type BeatChartEntry = {
    id : Id;
    rank : Nat;
    title : Text;
    producer : Text;
    bpm : Nat;
    genre : Text;
    audioLink : Text;
    isActive : Bool;
  };

  let beatChart = Map.empty<Id, BeatChartEntry>();

  module BeatChartEntry {
    public func compare(entry1 : BeatChartEntry, entry2 : BeatChartEntry) : Order.Order {
      Text.compare(entry1.title, entry2.title);
    };
  };

  public shared ({ caller }) func createBeatChartEntry(entry : BeatChartEntry) : async Id {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      RT.trap("Unauthorized: Only admins can create beat chart entries");
    };
    let id = freshId();
    let newEntry : BeatChartEntry = {
      id;
      rank = entry.rank;
      title = entry.title;
      producer = entry.producer;
      bpm = entry.bpm;
      genre = entry.genre;
      audioLink = entry.audioLink;
      isActive = entry.isActive;
    };
    beatChart.add(id, newEntry);
    id;
  };

  public shared ({ caller }) func updateBeatChartEntry(id : Id, entry : BeatChartEntry) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      RT.trap("Unauthorized: Only admins can update beat chart entries");
    };

    if (not beatChart.containsKey(id)) { RT.trap("Beat chart entry not found") };
    beatChart.add(id, entry);
  };

  public shared ({ caller }) func deleteBeatChartEntry(id : Id) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      RT.trap("Unauthorized: Only admins can delete beat chart entries");
    };

    if (not beatChart.containsKey(id)) { RT.trap("Beat chart entry not found") };
    beatChart.remove(id);
  };

  // Public read - no authorization required
  public query func getAllActiveBeatChartEntries() : async [BeatChartEntry] {
    beatChart.values().toArray().filter(func(entry) { entry.isActive }).sort();
  };

  // ProducerTip

  type ProducerTip = {
    id : Id;
    tipTitle : Text;
    tipBody : Text;
    producerName : Text;
    producerImageUrl : Text;
    isPublished : Bool;
  };

  let producerTips = Map.empty<Id, ProducerTip>();

  module ProducerTip {
    public func compare(tip1 : ProducerTip, tip2 : ProducerTip) : Order.Order {
      Text.compare(tip1.tipTitle, tip2.tipTitle);
    };
  };

  public shared ({ caller }) func createProducerTip(tip : ProducerTip) : async Id {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      RT.trap("Unauthorized: Only admins can create producer tips");
    };
    let id = freshId();
    let newTip : ProducerTip = {
      id;
      tipTitle = tip.tipTitle;
      tipBody = tip.tipBody;
      producerName = tip.producerName;
      producerImageUrl = tip.producerImageUrl;
      isPublished = tip.isPublished;
    };
    producerTips.add(id, newTip);
    id;
  };

  public shared ({ caller }) func updateProducerTip(id : Id, tip : ProducerTip) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      RT.trap("Unauthorized: Only admins can update producer tips");
    };

    if (not producerTips.containsKey(id)) { RT.trap("Producer tip not found") };
    producerTips.add(id, tip);
  };

  public shared ({ caller }) func deleteProducerTip(id : Id) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      RT.trap("Unauthorized: Only admins can delete producer tips");
    };

    if (not producerTips.containsKey(id)) { RT.trap("Producer tip not found") };
    producerTips.remove(id);
  };

  // Public read - no authorization required
  public query func getAllPublishedProducerTips() : async [ProducerTip] {
    producerTips.values().toArray().filter(func(tip) { tip.isPublished }).sort();
  };

  // Review

  type Review = {
    id : Id;
    artistName : Text;
    songTitle : Text;
    genre : Text;
    rating : Nat;
    commentary : Text;
    reviewerName : Text;
    reviewedAt : Time.Time;
    isPublished : Bool;
  };

  let reviews = Map.empty<Id, Review>();

  module Review {
    public func compare(review1 : Review, review2 : Review) : Order.Order {
      Text.compare(review1.songTitle, review2.songTitle);
    };
  };

  public shared ({ caller }) func createReview(review : Review) : async Id {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      RT.trap("Unauthorized: Only admins can create reviews");
    };
    let id = freshId();
    let newReview : Review = {
      id;
      artistName = review.artistName;
      songTitle = review.songTitle;
      genre = review.genre;
      rating = review.rating;
      commentary = review.commentary;
      reviewerName = review.reviewerName;
      reviewedAt = Time.now();
      isPublished = review.isPublished;
    };
    reviews.add(id, newReview);
    id;
  };

  public shared ({ caller }) func updateReview(id : Id, review : Review) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      RT.trap("Unauthorized: Only admins can update reviews");
    };

    if (not reviews.containsKey(id)) { RT.trap("Review not found") };
    reviews.add(id, review);
  };

  public shared ({ caller }) func deleteReview(id : Id) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      RT.trap("Unauthorized: Only admins can delete reviews");
    };

    if (not reviews.containsKey(id)) { RT.trap("Review not found") };
    reviews.remove(id);
  };

  // Public read - no authorization required
  public query func getAllPublishedReviews() : async [Review] {
    reviews.values().toArray().filter(func(review) { review.isPublished }).sort();
  };

  // SongSubmission

  type SongSubmission = {
    id : Id;
    artistName : Text;
    songTitle : Text;
    genre : Text;
    songLink : Text;
    contactEmail : Text;
    contactPhone : Text;
    submittedAt : Time.Time;
    status : Text;
    paymentStatus : Text;
  };

  let submissions = Map.empty<Id, SongSubmission>();

  module SongSubmission {
    public func compare(sub1 : SongSubmission, sub2 : SongSubmission) : Order.Order {
      Text.compare(sub1.songTitle, sub2.songTitle);
    };
  };

  // Public can create submissions - no authorization required
  public shared ({ caller }) func createSongSubmission(submission : SongSubmission) : async Id {
    let id = freshId();
    let newSubmission : SongSubmission = {
      id;
      artistName = submission.artistName;
      songTitle = submission.songTitle;
      genre = submission.genre;
      songLink = submission.songLink;
      contactEmail = submission.contactEmail;
      contactPhone = submission.contactPhone;
      submittedAt = Time.now();
      status = "pending";
      paymentStatus = "pending";
    };
    submissions.add(id, newSubmission);
    id;
  };

  public shared ({ caller }) func updateSubmissionStatus(id : Id, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      RT.trap("Unauthorized: Only admins can update submission status");
    };

    switch (submissions.get(id)) {
      case (null) { RT.trap("Submission not found") };
      case (?submission) {
        let updatedSubmission : SongSubmission = {
          id = submission.id;
          artistName = submission.artistName;
          songTitle = submission.songTitle;
          genre = submission.genre;
          songLink = submission.songLink;
          contactEmail = submission.contactEmail;
          contactPhone = submission.contactPhone;
          submittedAt = submission.submittedAt;
          status;
          paymentStatus = submission.paymentStatus;
        };
        submissions.add(id, updatedSubmission);
      };
    };
  };

  public shared ({ caller }) func updateSubmissionPaymentStatus(id : Id, paymentStatus : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      RT.trap("Unauthorized: Only admins can update payment status");
    };

    switch (submissions.get(id)) {
      case (null) { RT.trap("Submission not found") };
      case (?submission) {
        let updatedSubmission : SongSubmission = {
          id = submission.id;
          artistName = submission.artistName;
          songTitle = submission.songTitle;
          genre = submission.genre;
          songLink = submission.songLink;
          contactEmail = submission.contactEmail;
          contactPhone = submission.contactPhone;
          submittedAt = submission.submittedAt;
          status = submission.status;
          paymentStatus;
        };
        submissions.add(id, updatedSubmission);
      };
    };
  };

  public shared ({ caller }) func deleteSongSubmission(id : Id) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      RT.trap("Unauthorized: Only admins can delete submissions");
    };

    if (not submissions.containsKey(id)) { RT.trap("Submission not found") };
    submissions.remove(id);
  };

  // Admin-only read
  public shared ({ caller }) func getAllSongSubmissions() : async [SongSubmission] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      RT.trap("Unauthorized: Only admins can view submissions");
    };
    submissions.values().toArray().sort();
  };

  // Admin-only read
  public shared ({ caller }) func getSongSubmission(id : Id) : async SongSubmission {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      RT.trap("Unauthorized: Only admins can view submissions");
    };
    switch (submissions.get(id)) {
      case (null) { RT.trap("Submission not found") };
      case (?submission) { submission };
    };
  };

  // Subscriber

  type Subscriber = {
    id : Id;
    email : Text;
    subscribedAt : Time.Time;
  };

  let subscribers = Map.empty<Id, Subscriber>();

  module Subscriber {
    public func compare(sub1 : Subscriber, sub2 : Subscriber) : Order.Order {
      Text.compare(sub1.email, sub2.email);
    };
  };

  // Public can subscribe - no authorization required
  public shared ({ caller }) func createSubscriber(email : Text) : async Id {
    // Check for duplicate email
    if (subscribers.values().toArray().any(func(sub) { sub.email == email })) {
      RT.trap("Email already subscribed");
    };
    let id = freshId();
    let newSubscriber : Subscriber = {
      id;
      email;
      subscribedAt = Time.now();
    };
    subscribers.add(id, newSubscriber);
    id;
  };

  public shared ({ caller }) func deleteSubscriber(id : Id) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      RT.trap("Unauthorized: Only admins can delete subscribers");
    };

    if (not subscribers.containsKey(id)) { RT.trap("Subscriber not found") };
    subscribers.remove(id);
  };

  // Admin-only read
  public shared ({ caller }) func getAllSubscribers() : async [Subscriber] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      RT.trap("Unauthorized: Only admins can view subscribers");
    };
    subscribers.values().toArray().sort();
  };
};
