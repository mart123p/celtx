/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is XTF unit test components.
 *
 * The Initial Developer of the Original Code is
 * Alexander J. Vincent <ajvincent@gmail.com>.
 * Portions created by the Initial Developer are Copyright (C) 2007
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

function run_test() {
  const C_i = Components.interfaces;
  const nsIXTFElementFactory = C_i.nsIXTFElementFactory;
  const nsIXTFPrivate        = C_i.nsIXTFPrivate;
  const nsIDOMParser         = C_i.nsIDOMParser;
  const nsIDOMEventTarget    = C_i.nsIDOMEventTarget;
  do_load_module("/content/xtf/test/unit/xtfComponent.js");
  const xtfClass = "@mozilla.org/xtf/element-factory;1?namespace=";

  do_check_true(xtfClass + "xtf-tests;foo" in Components.classes);
  var fooFactory = Components.classes[xtfClass + "xtf-tests;foo"]
                             .getService(nsIXTFElementFactory);
  do_check_true(Boolean(fooFactory));

  var xmlSource = "<bar xmlns='xtf-tests;foo'/>";
  const parser     = Components.classes["@mozilla.org/xmlextras/domparser;1"]
                               .createInstance(nsIDOMParser);
  var xmlDoc = parser.parseFromString(xmlSource, "application/xml");
  do_check_true(xmlDoc.documentElement instanceof nsIXTFPrivate);
  do_check_true(xmlDoc.documentElement instanceof nsIDOMEventTarget);

  do_check_true(xmlDoc.documentElement.inner.wrappedJSObject.testpassed);

  // Bug 378247
  xmlDoc.documentElement.addEventListener("DOMNodeInserted",
    function foo() {
      dump('This is a DOMNodeInserted test.\n');
    },
    true);
  xmlDoc.documentElement.appendChild(xmlDoc.createTextNode("bar"));
  do_check_true(xmlDoc.documentElement.inner.wrappedJSObject.testpassed);

  xmlSource = "<handle_default xmlns='xtf-tests;foo'/>";
  xmlDoc = parser.parseFromString(xmlSource, "application/xml");
  do_check_true(xmlDoc.documentElement instanceof nsIXTFPrivate);
  do_check_true(xmlDoc.documentElement instanceof nsIDOMEventTarget);

  // Bug 378247
  xmlDoc.documentElement.addEventListener("DOMNodeInserted",
    function foo() {
      dump('This is a DOMNodeInserted test.\n');
    },
    true);
  xmlDoc.documentElement.appendChild(xmlDoc.createTextNode("bar"));
  do_check_true(xmlDoc.documentElement.inner.wrappedJSObject.testpassed);
}
