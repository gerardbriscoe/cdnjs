"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var OutMode_1 = require("../../Enums/OutMode");
var Utils_1 = require("../Utils/Utils");
var PolygonMaskType_1 = require("../../Enums/PolygonMaskType");
var Mover_1 = require("./Mover");
var RotateDirection_1 = require("../../Enums/RotateDirection");
var SizeAnimationStatus_1 = require("../../Enums/SizeAnimationStatus");
var OpacityAnimationStatus_1 = require("../../Enums/OpacityAnimationStatus");
var Updater = (function () {
    function Updater(container, particle) {
        this.container = container;
        this.particle = particle;
        this.mover = new Mover_1.Mover(container, particle);
    }
    Updater.checkBounds = function (coordinate, radius, size, outside) {
        if ((coordinate + radius > size) || (coordinate - radius < 0)) {
            outside();
        }
    };
    Updater.prototype.update = function (delta) {
        this.mover.move(delta);
        this.updateOpacity();
        this.updateSize();
        this.updateAngle();
        this.fixOutOfCanvasPosition();
        this.updateOutMode();
    };
    Updater.prototype.updateOpacity = function () {
        var particle = this.particle;
        if (particle.particlesOptions.opacity.animation.enable) {
            switch (particle.opacity.status) {
                case OpacityAnimationStatus_1.OpacityAnimationStatus.increasing:
                    if (particle.opacity.value >= particle.particlesOptions.opacity.value) {
                        particle.opacity.status = OpacityAnimationStatus_1.OpacityAnimationStatus.decreasing;
                    }
                    else {
                        particle.opacity.value += (particle.opacity.velocity || 0);
                    }
                    break;
                case OpacityAnimationStatus_1.OpacityAnimationStatus.decreasing:
                    if (particle.opacity.value <= particle.particlesOptions.opacity.animation.minimumValue) {
                        particle.opacity.status = OpacityAnimationStatus_1.OpacityAnimationStatus.increasing;
                    }
                    else {
                        particle.opacity.value -= (particle.opacity.velocity || 0);
                    }
                    break;
            }
            if (particle.opacity.value < 0) {
                particle.opacity.value = 0;
            }
        }
    };
    Updater.prototype.updateSize = function () {
        var _a;
        var container = this.container;
        var particle = this.particle;
        if (particle.particlesOptions.size.animation.enable) {
            switch (particle.size.status) {
                case SizeAnimationStatus_1.SizeAnimationStatus.increasing:
                    if (particle.size.value >= ((_a = particle.sizeValue) !== null && _a !== void 0 ? _a : container.retina.sizeValue)) {
                        particle.size.status = SizeAnimationStatus_1.SizeAnimationStatus.decreasing;
                    }
                    else {
                        particle.size.value += (particle.size.velocity || 0);
                    }
                    break;
                case SizeAnimationStatus_1.SizeAnimationStatus.decreasing:
                    if (particle.size.value <= particle.particlesOptions.size.animation.minimumValue) {
                        particle.size.status = SizeAnimationStatus_1.SizeAnimationStatus.increasing;
                    }
                    else {
                        particle.size.value -= (particle.size.velocity || 0);
                    }
            }
            if (particle.size.value < 0) {
                particle.size.value = 0;
            }
        }
    };
    Updater.prototype.updateAngle = function () {
        var particle = this.particle;
        if (particle.particlesOptions.rotate.animation.enable) {
            switch (particle.rotateDirection) {
                case RotateDirection_1.RotateDirection.clockwise:
                    particle.angle += particle.particlesOptions.rotate.animation.speed * Math.PI / 18;
                    if (particle.angle > 360) {
                        particle.angle -= 360;
                    }
                    break;
                case RotateDirection_1.RotateDirection.counterClockwise:
                default:
                    particle.angle -= particle.particlesOptions.rotate.animation.speed * Math.PI / 18;
                    if (particle.angle < 0) {
                        particle.angle += 360;
                    }
                    break;
            }
        }
    };
    Updater.prototype.fixOutOfCanvasPosition = function () {
        var container = this.container;
        var particle = this.particle;
        var outMode = particle.particlesOptions.move.outMode;
        var canvasSize = container.canvas.dimension;
        var newPos;
        if (outMode === OutMode_1.OutMode.bounce) {
            newPos = {
                bottom: canvasSize.height,
                left: particle.size.value,
                right: canvasSize.width,
                top: particle.size.value,
            };
        }
        else if (outMode === OutMode_1.OutMode.bounceHorizontal) {
            newPos = {
                bottom: canvasSize.height + particle.size.value - particle.offset.y,
                left: particle.size.value,
                right: canvasSize.width,
                top: -particle.size.value - particle.offset.y,
            };
        }
        else if (outMode === OutMode_1.OutMode.bounceVertical) {
            newPos = {
                bottom: canvasSize.height,
                left: -particle.size.value - particle.offset.x,
                right: canvasSize.width + particle.size.value + particle.offset.x,
                top: particle.size.value,
            };
        }
        else {
            newPos = {
                bottom: canvasSize.height + particle.size.value - particle.offset.y,
                left: -particle.size.value - particle.offset.x,
                right: canvasSize.width + particle.size.value + particle.offset.x,
                top: -particle.size.value - particle.offset.y,
            };
        }
        if (outMode === OutMode_1.OutMode.destroy) {
            var sizeValue = particle.size.value;
            if (!Utils_1.Utils.isPointInside(particle.position, container.canvas.dimension, sizeValue)) {
                container.particles.remove(particle);
            }
        }
        else {
            var sizeValue = particle.size.value;
            var nextBounds = Utils_1.Utils.calculateBounds(particle.position, sizeValue);
            if (nextBounds.left > canvasSize.width - particle.offset.x) {
                particle.position.x = newPos.left;
                particle.position.y = Math.random() * canvasSize.height;
            }
            else if (nextBounds.right < -particle.offset.x) {
                particle.position.x = newPos.right;
                particle.position.y = Math.random() * canvasSize.height;
            }
            if (nextBounds.top > canvasSize.height - particle.offset.y) {
                particle.position.y = newPos.top;
                particle.position.x = Math.random() * canvasSize.width;
            }
            else if (nextBounds.bottom < -particle.offset.y) {
                particle.position.y = newPos.bottom;
                particle.position.x = Math.random() * canvasSize.width;
            }
        }
    };
    Updater.prototype.updateOutMode = function () {
        var particle = this.particle;
        switch (particle.particlesOptions.move.outMode) {
            case OutMode_1.OutMode.bounce:
            case OutMode_1.OutMode.bounceVertical:
            case OutMode_1.OutMode.bounceHorizontal:
                this.updateBounce();
                break;
        }
    };
    Updater.prototype.updateBounce = function () {
        var container = this.container;
        var options = container.options;
        var particle = this.particle;
        if (options.polygon.enable && options.polygon.type !== PolygonMaskType_1.PolygonMaskType.none &&
            options.polygon.type !== PolygonMaskType_1.PolygonMaskType.inline) {
            if (!container.polygon.checkInsidePolygon(particle.position)) {
                this.polygonBounce();
            }
        }
        else if (options.polygon.enable && options.polygon.type === PolygonMaskType_1.PolygonMaskType.inline) {
            if (particle.initialPosition) {
                var dist = Utils_1.Utils.getDistanceBetweenCoordinates(particle.initialPosition, particle.position);
                if (dist > container.retina.polygonMaskMoveRadius) {
                    this.polygonBounce();
                }
            }
        }
        else {
            var outMode = particle.particlesOptions.move.outMode;
            var x = particle.position.x + particle.offset.x;
            var y = particle.position.y + particle.offset.y;
            if (outMode === OutMode_1.OutMode.bounce || outMode === OutMode_1.OutMode.bounceHorizontal) {
                Updater.checkBounds(x, particle.size.value, container.canvas.dimension.width, function () {
                    particle.velocity.horizontal = -particle.velocity.horizontal;
                });
            }
            if (outMode === OutMode_1.OutMode.bounce || outMode === OutMode_1.OutMode.bounceVertical) {
                Updater.checkBounds(y, particle.size.value, container.canvas.dimension.height, function () {
                    particle.velocity.vertical = -particle.velocity.vertical;
                });
            }
        }
    };
    Updater.prototype.polygonBounce = function () {
        var particle = this.particle;
        particle.velocity.horizontal = -particle.velocity.horizontal + (particle.velocity.vertical / 2);
        particle.velocity.vertical = -particle.velocity.vertical + (particle.velocity.horizontal / 2);
    };
    return Updater;
}());
exports.Updater = Updater;
