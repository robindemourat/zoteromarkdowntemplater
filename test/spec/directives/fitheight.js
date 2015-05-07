'use strict';

describe('Directive: fitHeight', function () {

  // load the directive's module
  beforeEach(module('zoteromarkdownApp'));

  var element,
    scope;

  beforeEach(inject(function ($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function ($compile) {
    element = angular.element('<fit-height></fit-height>');
    element = $compile(element)(scope);
    expect(element.text()).toBe('this is the fitHeight directive');
  }));
});
