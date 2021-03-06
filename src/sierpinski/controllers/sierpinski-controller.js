import window from 'window'
import { Vector3 } from 'three'
import Services from './../../core/services'
import Controller from './../../core/mvc/controller'
import MouseEvent from './../..//core/services/mouse/mouse-event'

export default class SierpinskiController extends Controller {
  constructor (model, view) {
    super(model, view)
    this._mouse = Services.locate('Mouse')
    this._mouse.addEventListener(MouseEvent.WHEEL, this.onMouseWheel.bind(this))
    this._mouse.addEventListener(MouseEvent.DOWN, this.onMouseDown.bind(this))
    this._mouse.addEventListener(MouseEvent.MOVE, this.onMouseMove.bind(this))
    this._mouse.addEventListener(MouseEvent.UP, this.onMouseUp.bind(this))
  }
  onMouseDown (event) {
    this._startMousePosition = this._mouse.position.clone()
    this._startViewPosition = this.view.position.clone()
  }
  onMouseMove (event) {
    if (this._mouse.held) {
      this.view.position.set(
        this._startViewPosition.x + (this._mouse.position.x - this._startMousePosition.x),
        this._startViewPosition.y - (this._mouse.position.y - this._startMousePosition.y),
        0
      )
      if (!this.view.rendering) this.view.render()
    }
  }
  onMouseUp (event) {
    this._startMousePosition = null
    this._startViewPosition = null
  }
  onMouseWheel (event) {
    let delta = this._view.scale.x * event.delta.y / 1000
    this._view.scale.addScalar(delta)
    let mouse = new Vector3(
      this._mouse.position.x - (window.innerWidth / 2),
      -(this._mouse.position.y - (window.innerHeight / 2)),
      0
    )
    this._view.worldToLocal(mouse)
    mouse.multiplyScalar(delta)
    this._view.position.sub(mouse)
    let depth = Math.floor(Math.sqrt(this._view.scale.x))
    this.model.depth = depth + 5
    if (!this.view.rendering) this.view.render()
  }
}
