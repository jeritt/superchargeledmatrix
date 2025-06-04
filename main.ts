// Define a namespace for your extension to avoid naming conflicts
//% weight=100 color=#0fbc11 icon="\uf00a" block="Matrix8x32"
namespace matrix8x32 {
    let strip: neopixel.Strip = null;
    let numLeds: number = 256; // Default number of LEDs
    let matrixWidth: number = 32; // Default width
    let matrixHeight: number = 8;  // Default height

    /**
     * Initializes the LED matrix.
     * @param pin The pin the LED matrix is connected to, eg: DigitalPin.P0
     * @param totalLeds The total number of LEDs in the matrix, eg: 256
     * @param width The width of the matrix (number of LEDs horizontally), eg: 32
     * @param height The height of the matrix (number of LEDs vertically), eg: 8
     */
    //% block="initialize matrix on pin %pin with %totalLeds LEDs (width: %width, height: %height)"
    //% totalLeds.defl=256
    //% width.defl=32
    //% height.defl=8
    //% weight=90
    export function initializeMatrix(pin: DigitalPin, totalLedsValue: number, width: number, height: number): void {
        numLeds = totalLedsValue;
        matrixWidth = width;
        matrixHeight = height;
        strip = neopixel.create(pin, numLeds, NeoPixelMode.RGB);
        strip.clear();
        strip.show();
    }

    /**
     * Sets the color of a single pixel on the matrix using X, Y coordinates.
     * Accounts for zig-zag layout.
     * @param x The horizontal position (0 to width-1)
     * @param y The vertical position (0 to height-1)
     * @param color The color to set (e.g., 0xff0000 for red)
     */
    //% block="set pixel at x %x y %y to color %color=neopixel_colors"
    //% weight=80
    export function setPixel(x: number, y: number, color: number): void {
        if (!strip || x < 0 || x >= matrixWidth || y < 0 || y >= matrixHeight) {
            return;
        }

        let pixelIndex: number;
        // Zig-zag mapping:
        // Even columns (0, 2, 4...) go from top to bottom (y = 0 to height-1)
        // Odd columns (1, 3, 5...) go from bottom to top (y = height-1 to 0)
        if (x % 2 === 0) { // Even column
            pixelIndex = x * matrixHeight + y;
        } else { // Odd column
            pixelIndex = x * matrixHeight + (matrixHeight - 1 - y);
        }

        if (pixelIndex < numLeds) {
            strip.setPixelColor(pixelIndex, color);
        }
    }

    /**
     * Clears all pixels on the matrix.
     */
    //% block="clear matrix"
    //% weight=70
    export function clearMatrix(): void {
        if (strip) {
            strip.clear();
        }
    }

    /**
     * Shows the changes on the LED matrix.
     */
    //% block="show changes"
    //% weight=60
    export function show(): void {
        if (strip) {
            strip.show();
        }
    }

    /**
     * Scrolls a short text message on the matrix.
     * (This is a simplified example; full text scrolling is more complex)
     * @param text The text to scroll
     * @param color The color of the text
     * @param delay The delay between scroll steps in ms, eg: 150
     */
    //% block="scroll text %text with color %color=neopixel_colors speed %delay ms"
    //% weight=50
    //% text.defl="Hi!"
    //% delay.defl=150
    export function scrollText(text: string, color: number, delay: number): void {
        if (!strip) return;

        // For simplicity, this example will show one character at a time
        // and simulate scrolling by shifting.
        // A proper implementation would involve a character font and pixel-level shifting.

        for (let i = 0; i < text.length; i++) {
            basic.clearScreen(); // Clear micro:bit screen (if you want to show on both)
            strip.clear();
            // Display character (very basic, assumes 5x7 font or similar)
            // You would need a font map here.
            // For simplicity, let's just light up a column pattern per character.
            // This part needs significant expansion for real text rendering.
            for (let col = 0; col < matrixWidth; col++) {
                for (let row = 0; row < matrixHeight; row++) {
                    // Placeholder: Light up a segment based on character and column
                    // This is where you'd map character font pixels to your matrix
                    if (col >= i * matrixHeight && col < (i + 1) * matrixHeight) { // Rough character width
                         // Example: turn on a diagonal line for each "character"
                        if (row === (col % matrixHeight)) {
                             setPixel(col, row, color);
                        }
                    }
                }
            }
            strip.show();
            basic.pause(delay);
        }
        strip.clear();
        strip.show();
    }

    /**
     * Draws a predefined image (represented by an array of colors).
     * The image array should be 1D, matching the zig-zag layout.
     * @param image_data An array of color numbers for each LED
     */
    //% block="draw image %image_data"
    //% image_data.shadow="lists_create_with"
    //% image_data.defl="[0,0,0,0,0,0,0,0]"
    //% weight=40
    export function drawImage(image_data: number[]): void {
        if (!strip) return;
        strip.clear();
        for (let i = 0; i < numLeds && i < image_data.length; i++) {
            strip.setPixelColor(i, image_data[i]); // Assumes image_data is already zig-zag mapped
        }
        strip.show();
    }

    // Helper for creating image arrays more easily if needed (advanced)
    // You might create blocks to define images row by row or column by column
    // and then convert them to the zig-zag 1D array.
}
