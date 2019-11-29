M42 Custom Podcast Service
=================

Better name pending!

## What is this?

This web-app allows you to combine parts of various podcasts into a single, custom podcast RSS feed.

The audio you wish to add to your custom podcast need not already be in another podcast. Any audio
that you have a URL directly linking to can be added to your personal podcast.

### Why is this?

Often, a podcast will create a series of interelated episodes that are mixed in with other, 
unrelated episodes.  
With this app you can build a custom podcast that contains only those episodes you are
interested in, in the order you wish to play them.

A few podcasts have back catalogs to large to fit into a single
RSS feed, but the episodes are still available for download on their website.  
You can create a feed of your own, that includes those 'lost episodes', for easy playback.

Or, you may wish to mix two or more podcasts into a single feed. For example, you may wish to listen to 
a reading of [Stories by H. P. Lovecraft](http://feeds.feedburner.com/thecompletehplovecraf "The Complete HP Lovecraft"), 
each followed by an episode of another [Podcast discussing and analysing that story](https://hppodcraft.com/ "The HP Lovecraft Literary Podcast").  
This app will let you line up the episodes of these seperate podcasts into a single feed.


## Technical Stuff

### API specification

The backend of this app is a Node.js server presenting a RESTful API.

#### /feeds/{feed id}

- GET

  Replys with the XML document defining the RSS feed corrosponding to {feed id} and status 200.  
  If no RSS feed corosponds to the {feed id} provided, replys with status 404.
  
#### /data/{feed id}

## Installation

TODO: Installation instructions

