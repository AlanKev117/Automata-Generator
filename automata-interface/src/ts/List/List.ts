import { Node } from "../Node/Node";
class Lists{ 
    size: number;
    head: Node;
    constructor(){
        this.size = 0;
        this.head = null;
    }
  
  public append = (value, current) => {
    current = this.head;
    if(this.head === null){
        return this.head = new Node(value)
    }
    if(current.next === null){
        return current.next = new Node(value)
    }
    if(current.down === null){
        return current.down = new Node(value);
    }
    this.append(value, current.next);
    this.append(value, current.down);
  }
  
  public prepend = (value) => {
    if(this.head === null){
      return this.head = new Node(value)
    }
    let newNode = new Node(value)
    newNode.next = this.head
    newNode.down = this.head
    this.head = newNode
  }
  
  public removeNode = (value, current) => {
    current  = this.head;
    if(this.head === null){ // no head
      return false
    }
  
    if (this.head.value === value){
      return this.head = this.head.next;
    }
  
    if(current.next !== null){
      if(current.next.value === value){
        return current.next = current.next.next
      }
      this.removeNode(value, current.next)
    }
    return false // no match found
  }
  
  findNode = (value, current) => {
      current = this.head;
    if(this.head === null) {
      return false
    }
    if (current !== null) {
      if (current.value === value){
        return true
      } else {
        return this.findNode(value, current.next)
      }
    }
    return false
  }
  
  peekNode = (value) => {
    if(this.head === null) {
      return false
    }
    return this.head
  }
  
  listLength = (current, acum) => {
      current = this.head;
      acum = 1;
    if(this.head === null){
      return 0
    }
    if (current.next !== null){
      return this.listLength(current.next, acum = acum + 1)
    }
    return acum
  }
}
export {Lists}