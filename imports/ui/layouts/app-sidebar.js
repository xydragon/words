import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Template } from 'meteor/templating';
import { ActiveRoute } from 'meteor/zimme:active-route';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { TAPi18n } from 'meteor/tap:i18n';
import { T9n } from 'meteor/softwarerero:accounts-t9n';
import { _ } from 'meteor/underscore';
import { $ } from 'meteor/jquery';

import { Lists } from '../../api/lists/lists.js';
import { insert } from '../../api/lists/methods.js';

Template.Side_bar.onCreated(function appBodyOnCreated() {
    this.subscribe('lists.public');
    this.subscribe('lists.private');
  
    this.state = new ReactiveDict();
    this.state.setDefault({
      menuOpen: false,
      userMenuOpen: false,
    });
});

Template.Side_bar.helpers({
    emailLocalPart() {
        const email = Meteor.user().emails[0].address;
        return email.substring(0, email.indexOf('@'));
    },
    userMenuOpen() {
        const instance = Template.instance();
        return instance.state.get('userMenuOpen');
    },
    languages() {
        return _.keys(TAPi18n.getLanguages());
    },
    isActiveLanguage(language) {
        return (TAPi18n.getLanguage() === language);
    },
    lists() {
        return Lists.find({ $or: [
          { userId: { $exists: false } },
          { userId: Meteor.userId() },
        ] });
    },
    activeListClass(list) {
        const active = ActiveRoute.name('Lists.show')
          && FlowRouter.getParam('_id') === list._id;
    
        return active && 'active';
    },
});

Template.Side_bar.events({
    'click .js-user-menu'(event, instance) {
        instance.state.set('userMenuOpen', !instance.state.get('userMenuOpen'));
        // stop the menu from closing
        event.stopImmediatePropagation();
      },
    
});