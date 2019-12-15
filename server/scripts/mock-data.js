var app = require('../server');

const initialBranch = {
  name: 'master',
  description: 'Initial master branch',
  draft_version: 1000,
}

const initialLocale = {
  code: 'en',
  name: 'English'
}

const sampleCollections = [
  {
    version: 1000,
    name: 'Mock collection 1',
    handle: 'mock_collection_1',
    description: 'Mock colletion for testing',
  },
  {
    version: 1000,
    name: 'Mock collection 2',
    handle: 'mock_collection_2',
    description: 'Mock colletion for testing',
  },
  {
    version: 1000,
    name: 'Mock collection 3',
    handle: 'mock_collection_3',
    description: 'Mock colletion for testing',
  },
  {
    version: 1000,
    name: 'Mock collection 4',
    handle: 'mock_collection_4',
    description: 'Mock colletion for testing',
  }
]

const sampleTexts = [
  {
    key: 'upload_button',
    value: 'Upload Button Text',
    locale: 'en',
    archived: false,
  },
  {
    key: 'header_text',
    value: 'This is the page heading',
    locale: 'en',
    archived: false,
  },
  {
    key: 'next_page',
    value: 'Click here to go to next page',
    locale: 'en',
    archived: false,
  },
  {
    key: 'subscribe',
    value: 'Subscribe to the plan',
    locale: 'en',
    archived: false,
  },
  {
    key: 'tax_total',
    value: 'Your total tax amount is',
    locale: 'en',
    archived: false,
  },
]

async function mock(){
  const Branch = app.models.Branches
  const Collection = app.models.BranchedCollection
  const Text = app.models.BranchText
  const Locale = app.models.Locale
  
  try {
    let branch = await Branch.findOne();
    if(!branch) {
      branch = await Branch.create(initialBranch)
      console.log('Branch created', branch.id)

      for(let i in sampleCollections) {
        const collectionObj = sampleCollections[i]
        collectionObj.branch_id = branch.id
        const collection = await Collection.create(collectionObj)
        console.log('Collection created', collection.id)

        const sampleData = sampleTexts.map(text => {
          text.collection_id = collection.id
          return text;
        })
        await Text.create(sampleData)
        console.log('Texts created')
      }

    } else {
      console.log('Branch already exists')
    }

    let locale = await Locale.findOne()
    if(!locale) {
      locale = await Locale.create(initialLocale)
      console.log('Locale created')
    } else {
      console.log('Locale already exists')
    }

    process.exit(0)
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
  
}

mock()
