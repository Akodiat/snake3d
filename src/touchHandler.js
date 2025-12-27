class TouchHandler extends EventTarget{
    constructor(canvas) {
        super();

        const ongoingTouches = new Map();

        canvas.addEventListener('touchstart', event => {
            event.preventDefault();

            for (const changedTouch of event.changedTouches) {
                ongoingTouches.set(changedTouch.identifier, {
                    pageX: changedTouch.pageX,
                    pageY: changedTouch.pageY,
                });
            }
        }, false);

        canvas.addEventListener('touchend', event => {
            event.preventDefault();

            for (const changedTouch of event.changedTouches) {
                const touch = ongoingTouches.get(changedTouch.identifier);
                if (!touch) {
                    console.error(`End: Could not find touch ${changedTouch.identifier}`);
                    continue;
                }

                const dX = touch.pageX - changedTouch.pageX;
                const dY = touch.pageY - changedTouch.pageY;

                ongoingTouches.delete(changedTouch.identifier);

                // Tap
                if (dX === 0 && dY === 0) {
                    // Was the tap on the left or right half of the screen?
                    if (touch.pageX < canvas.width/2) {
                        this.dispatchEvent(new Event("tapLeft"));
                    } else {
                        this.dispatchEvent(new Event("tapRight"));
                    }
                    continue;
                }

                // Which way did the swipe go (most)
                if (Math.abs(dX) > Math.abs(dY)) {
                    if (dX > 0) {
                        this.dispatchEvent(new Event("swipeLeft"));
                    } else {
                        this.dispatchEvent(new Event("swipeRight"));
                    }
                } else {
                    if (dY > 0) {
                        this.dispatchEvent(new Event("swipeUp"));
                    } else {
                        this.dispatchEvent(new Event("swipeDown"));
                    }
                }
            }
        }, false);

    }
}

export {TouchHandler}