import { __decorate, __metadata } from 'tslib';
import { defineInjectable, inject, Injectable } from '@angular/core';
import { Angulartics2 } from 'angulartics2';

let Angulartics2Amplitude = class Angulartics2Amplitude {
    constructor(angulartics2) {
        this.angulartics2 = angulartics2;
        this.angulartics2.setUsername
            .subscribe((x) => this.setUsername(x));
        this.angulartics2.setUserProperties
            .subscribe((x) => this.setUserProperties(x));
        this.angulartics2.setUserPropertiesOnce
            .subscribe((x) => this.setUserProperties(x));
    }
    startTracking() {
        this.angulartics2.pageTrack
            .pipe(this.angulartics2.filterDeveloperMode())
            .subscribe((x) => this.pageTrack(x.path));
        this.angulartics2.eventTrack
            .pipe(this.angulartics2.filterDeveloperMode())
            .subscribe((x) => this.eventTrack(x.action, x.properties));
    }
    pageTrack(path) {
        try {
            this.eventTrack('Pageview', {
                url: path
            });
        }
        catch (e) {
            if (!(e instanceof ReferenceError)) {
                throw e;
            }
        }
    }
    eventTrack(action, properties) {
        try {
            amplitude.getInstance().logEvent(action, properties);
        }
        catch (e) {
            if (!(e instanceof ReferenceError)) {
                throw e;
            }
        }
    }
    setUsername(userId) {
        try {
            amplitude.getInstance().setUserId(userId);
        }
        catch (e) {
            if (!(e instanceof ReferenceError)) {
                throw e;
            }
        }
    }
    setUserProperties(properties) {
        try {
            amplitude.getInstance().setUserProperties(properties);
        }
        catch (e) {
            if (!(e instanceof ReferenceError)) {
                throw e;
            }
        }
    }
};
Angulartics2Amplitude.ngInjectableDef = defineInjectable({ factory: function Angulartics2Amplitude_Factory() { return new Angulartics2Amplitude(inject(Angulartics2)); }, token: Angulartics2Amplitude, providedIn: "root" });
Angulartics2Amplitude = __decorate([
    Injectable({ providedIn: 'root' }),
    __metadata("design:paramtypes", [Angulartics2])
], Angulartics2Amplitude);

/**
 * Generated bundle index. Do not edit.
 */

export { Angulartics2Amplitude };
//# sourceMappingURL=angulartics2-amplitude.js.map
