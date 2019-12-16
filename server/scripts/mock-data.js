var app = require('../server');

const initialBranch = {
  name: 'master',
  description: 'Initial master branch',
  draft_version: 1000,
}

const rawText = {
  "brand": {
    "en": {
      "see_in_action": "See it in action",
      "choose_logo_type": "Choose a logo type",
      "checkout.title": "Here's a mock of the Chargebee checkout to help you visualise how all the branding will look like.",
      "checkout.caption": "Go ahead, play around with your brand elements and color!",
      "checkout.old_version": "You're using an older version of Checkout",
      "checkout.new_version": "The new checkout is simple, elegant, and designed for a much better checkout experience.",
      "checkout.changes_applied_info": "These changes will be applied to both Checkout and Self-serve portal",
      "portal.title": "This is a mock of the customers' self-serve portal. Preview all your branding here to visualise what your customers will see.",
      "portal.caption": "Go ahead, play around with your brand elements and color!",
      "portal.old_version": "You're using an older version of the Self-serve portal.",
      "portal.new_version": "The self-serve portal is now simpler, intuitive, and designed to make your customers become more self-sufficient.",
      "email.title": "This is a mock email to help you visualise what your emails will look like.",
      "email.caption": "Go ahead, play around with your brand elements and color!",
      "email.send_test_email": "Send test mail",
      "email.powered_by_cb": "Powered by Chargebee",
      "email.text_placeholder": "Your text goes here",
      "email.old_version": "You're still using the older version of our email notifications.",
      "email.new_version": "Our new email notifications are simple, adaptive, and full of new features. Enable now to communicate better with your customers.",
      "invoice.title": "Use this mock invoice to visualise how your actual invoices will look like.",
      "invoice.caption": "Go ahead, play around with your brand elements and color!",
      "invoice.preview_sample_invoice": "Preview sample invoice",
      "settings.title": "Upload your global brand identities.",
      "settings.caption": "These will appear on your emails, invoices, credit notes checkout pages, and your customers' self-serve portal.",
      "settings.pick_color": "Pick an accent color",
      "settings.pick_color_desc": "This color will be used for buttons, links, and other highlights.",
      "settings.color_help": "The color you chose is too light for an accent color",
      "settings.color_picked": "COLOR YOU PICKED",
      "settings.quick_action_btn": "Quick-Action button",
      "settings.recommended_color": "COLOR WE RECOMMEND",
      "settings.use_recommendation": "USE OUR RECOMMENDATION",
      "settings.pick_from_swatch": "Pick a color from our swatch"
    }
  }
}

async function createLocales(locales) {
  const Locale = app.models.Locale

  for(i in locales) {
    const locale = locales[i]

    const localeInstance = await Locale.findOne({ where: { code: locale }})
    if(!localeInstance) {
      await Locale.create({
        code: locale,
        name: locale,
      })
    }
  }
}

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

      const sampleCollections = Object.keys(rawText) 

      for(let i in sampleCollections) {
        const collectionName = sampleCollections[i]
        const localeText = rawText[collectionName];
        const locales = Object.keys(localeText)

        await createLocales(locales);

        const collectionObj = {
          version: branch.draft_version,
          name: collectionName.toUpperCase(),
          handle: collectionName,
          description: `${collectionName} Collection`,
          branch_id: branch.id,
        }

        const collection = await Collection.create(collectionObj)
        console.log('Collection created', collection.id)

        for(i in locales) {
          const locale = locales[i]
          const flatText = localeText[locale]
          const newTextData = Object.keys(flatText).map(key => {
            const value = flatText[key]
            return {
              key,
              value,
              locale,
              archived: false,
              description: '',
              collection_id: collection.id
            }
          })

          await Text.create(newTextData)
          console.log('Texts created', collection.handle, locale, newTextData.length)
        }
      }
    } else {
      console.log('Branch already exists')
    }
    process.exit(0)
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
  
}

mock()
