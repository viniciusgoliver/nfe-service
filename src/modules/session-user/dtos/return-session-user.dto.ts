export class SessionReturnSessionUserDTO {
  id: number
  guid: string
  user_id: number
  session_state: string
  from_ip: string
  created_at?: Date
  updated_at?: Date
}
