import type { Map as MapLibreMap } from "maplibre-gl";

/**
 * Controlador de Animación de Órbita Continua para la Cámara de MapLibre GL
 *
 * - **¿Qué hace?**: Implementa una rotación de cámara suave y continua encadenando tramos lineales de 90°
 *   mediante el método nativo `map.rotateTo()`. Al completarse cada tramo (`moveend`), programa el siguiente
 *   con `requestAnimationFrame`. Si el mapa queda fuera del viewport (`setVisible(false)`), detiene la animación.
 * - **¿Cómo interactúa con el sistema en general?**: Usada por `shared-map.ts` para el giro de bienvenida en la portada
 *   y por `CityMap` para el botón interactivo "Girar 360°".
 * - **¿Cuál es su importancia?**: Optimiza el rendimiento de la GPU y CPU. Rotar la cámara cuadro a cuadro manualmente
 *   (con `setBearing`) forzaba el recálculo total de etiquetas en cada frame; encadenar `rotateTo` permite a MapLibre
 *   recalcular las etiquetas de forma incremental, consumiendo hasta 10 veces menos recursos.
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

  /**
   * Indica si la órbita de rotación está activa.
   *
   * - **¿Qué hace?**: Comprueba si la velocidad configurada (`speed`) es diferente de cero.
   * - **¿Cómo interactúa con el sistema en general?**: Leída por `CityMap` para reflejar el estado del botón "Girar 360°".
   * - **¿Cuál es su importancia?**: Ofrece una propiedad booleana simple para consultar el estado del bucle de animación.
   */
  get running(): boolean {
    return this.speed !== 0;
  }

  /**
   * Inicia la rotación continua a una velocidad determinada.
   *
   * - **¿Qué hace?**: Asigna la velocidad en grados por segundo, detiene animaciones previas e inicia el primer tramo.
   * - **¿Cómo interactúa con el sistema en general?**: Invocada en la portada (`INTRO_SPIN = 2°/s`) o por el usuario (`ORBIT_SPIN = 9°/s`).
   * - **¿Cuál es su importancia?**: Activa el movimiento panorámico cinematográfico del mapa.
   */
  start(degreesPerSecond: number) {
    this.speed = degreesPerSecond;
    this.halt();
    this.next();
  }

  /**
   * Detiene permanentemente el giro de la cámara.
   *
   * - **¿Qué hace?**: Restablece la velocidad a 0 y detiene la animación en curso en el mapa de MapLibre.
   * - **¿Cómo interactúa con el sistema en general?**: Invocada al interactuar manualmente con el mapa o hacer clic en "Detener giro".
   * - **¿Cuál es su importancia?**: Cede inmediatamente el control de la cámara a los gestos del usuario.
   */
  stop() {
    this.speed = 0;
    this.halt();
  }

  /**
   * Modula la ejecución de la animación según la visibilidad del mapa en pantalla.
   *
   * - **¿Qué hace?**: Si el mapa sale del viewport (detectado por un `IntersectionObserver`), pausa el giro para no consumir GPU;
   *   cuando vuelve a entrar, reanuda el movimiento si había una velocidad configurada.
   * - **¿Cómo interactúa con el sistema en general?**: Coordinada por el observador de intersección en `CityMap`.
   * - **¿Cuál es su importancia?**: Evita el desperdicio de batería y ciclos de GPU en pestañas o vistas no visibles.
   */
  setVisible(visible: boolean) {
    if (visible === this.visible) return;
    this.visible = visible;
    if (visible) this.next();
    else this.halt();
  }

  /**
   * Interrumpe el tramo de giro actual sin encadenar el siguiente.
   */
  private halt() {
    if (!this.turning) return;
    this.turning = false; // antes de stop(): su "moveend" no debe encadenar otro tramo
    this.map.stop();
  }

  /**
   * Ejecuta el siguiente tramo de rotación de 90°.
   */
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
