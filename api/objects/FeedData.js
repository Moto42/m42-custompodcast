const DOMParser = require('xmldom').DOMParser;
const XMLSerializer = require('xmldom').XMLSerializer;

function FeedData(data={}) {
  this.feedID   = data.feedID   || (Math.round(Math.random()*100000000000))+"";
  this.doners   = data.doners   || [];
  this.title    = data.title    || "Untitled Feed",
  this.link     = data.link     || 'https://wwww.google.com',
  this.imgUrl   = data.imgUrl   || 'https://wwww.google.com',
  this.explicit = data.explicit || false,
  this.category = data.category || 'Technology',
  this.description = data.description || 'no description given',
  this.owner_name  = data.owner_name || 'No One',
  this.owner_email = data.owner_email || 'Private@email.com',
  this.owner_email = data.owner_email || 'Private@email.com',

  this.items = [];

  if(data.items && data.items.length > 0){

    for(let item of data.items){
      if(!item.title && !item.description) continue;
      if(!item.url || !item.length) continue;

      const newItem = {
        episodeNumber: item.episodeNumber,
        title : item.title || '',
        description : item.description || '',
        url : item.url || '',
        pubDate: item.pubDate || '',
        length :item.length || 11,
        }

      if(item.sourceURL) {
        newItem.source = item.sourcURL;
      }

      this.items.push(newItem);
    }
  }

}


function toXML(data){
  const xmltemplate = `<?xml version='1.0' encoding='utf-8'?>
  <rss xmlns:itunes='http://www.itunes.com/dtds/podcast-1.0.dtd' version='2.0'>
    <channel>
		  <language>en-us</language>
      <title>${data.title || ''}</title>
      <description>${data.description || ''}</description>
      <link>${data.link}</link>
      <image>
        <url>${data.imgUrl}</url>
        <title>${data.title}</title>
        <link>${data.link}</link>
      </image>
      <itunes:image href="${data.imgUrl}" />

    <itunes:owner>
      <itunes:name>${data.owner_name}</itunes:name>
      <itunes:email>${data.owner_email}</itunes:email>
    </itunes:owner>
    <itunes:explicit>${data.explicit ? 'yes':'no'}</itunes:explicit>
    <itunes:category text="Technology"/></itunes:category>

    </channel>
  </rss>
  `;

  const xml = (new DOMParser()).parseFromString(xmltemplate,'text.xml')
  const channel = xml.getElementsByTagName('channel')[0];

  if(data.items) {
    for( item of data.items){
      if(!item.url) continue;

      item.title = item.title ? item.title : '';
      item.description = item.description ? item.description : '';

      const nextItem = `<item>
        <title> ${item.title} </title>
        <description> ${item.description} </description>
        <enclosure url='${item.url}' type='audio/mpeg' length="${item.length}" />
        <pubDate>${item.pubDate || '01 Jan 2000 00:00:00 +0000'}</pubDate>
      </item>`;

      channel.appendChild((new DOMParser()).parseFromString(nextItem));
    }
  }

  return (new XMLSerializer()).serializeToString(xml)
}

Object.defineProperties(FeedData.prototype, {
  xml : {
    get : function () {return toXML(this);},
    set : function () {return;}
  }
});


module.exports = FeedData;
