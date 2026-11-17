import type { Map as MapLibreMap } from "maplibre-gl";

/**
 * Giro continuo de la cámara con la animación propia de MapLibre: tramos lineales de 90°
 * encadenados, sin cortes. Así MapLibre recalcula las etiquetas de forma incremental;
 * mover la cámara a mano en cada cuadro las recalculaba todas y costaba 10 veces más.
 * Si el mapa no se ve, no gira (y no dibuja); en una pestaña oculta el navegador ya lo pausa.
 */
export class CameraOrbit {
  private speed = 0;
  private visible = true;
  private turning = false;

  constructor(private readonly map: MapLibreMap) {
    map.on("moveend", () => {
      // Al terminar un tramo, sigue con el siguiente (si nadie lo detuvo)
      if (!this.turning) return;
      this.turning = false;
      // Un cuadro después: si otra animación (p. ej. la brújula) cortó el tramo, ya está en curso y se respeta
      requestAnimationFrame(() => this.next());
    });
  }

  get running(): boolean {
    return this.speed !== 0;
  }

  start(degreesPerSecond: number) {
    this.speed = degreesPerSecond;
    this.halt();
    this.next();
  }

  stop() {
    this.speed = 0;
    this.halt();
  }

  setVisible(visible: boolean) {
    if (visible === this.visible) return;
    this.visible = visible;
    if (visible) this.next();
    else this.halt();
  }

  private halt() {
    if (!this.turning) return;
    this.turning = false; // antes de stop(): su "moveend" no debe encadenar otro tramo
    this.map.stop();
  }

  private next() {
    if (!this.speed || !this.visible || this.turning || this.map.isMoving()) return;
    const step = 90;
    this.turning = true;
    this.map.rotateTo(this.map.getBearing() + step, {
      duration: (step / this.speed) * 1000,
      easing: (t) => t,
    });
  }
}
