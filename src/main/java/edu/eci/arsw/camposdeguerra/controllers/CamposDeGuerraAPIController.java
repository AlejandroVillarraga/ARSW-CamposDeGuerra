/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.camposdeguerra.controllers;


import edu.eci.arsw.camposdeguerra.model.Maquina;
import edu.eci.arsw.camposdeguerra.model.Usuario;
import edu.eci.arsw.camposdeguerra.persistence.CamposDeGuerraNotFoundException;
import edu.eci.arsw.camposdeguerra.persistence.CamposDeGuerraPersistenceException;
import edu.eci.arsw.camposdeguerra.services.CamposDeGuerraServices;

import java.util.logging.Level;
import java.util.logging.Logger;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping(value = "/CamposDeGuerra")
public class CamposDeGuerraAPIController {

    @Autowired
    private CamposDeGuerraServices cdg;
    
    
    
    
    @RequestMapping(path = "/{user}",method = RequestMethod.GET)
    public ResponseEntity<?> getUsuario(@PathVariable String user) {
        try {
            //Obtener datos
            return new ResponseEntity<>(cdg.getUsuario(user), HttpStatus.ACCEPTED);
        } catch (CamposDeGuerraNotFoundException ex) {
            Logger.getLogger(CamposDeGuerraAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
    
	
    @RequestMapping(method = RequestMethod.GET)
    public ResponseEntity<?> getAllUsuarios() {
        try {
            //Obtener datos
            return new ResponseEntity<>(cdg.getAllUsuarios(), HttpStatus.ACCEPTED);
        } catch (CamposDeGuerraNotFoundException ex) {
            Logger.getLogger(CamposDeGuerraAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
        }
    }
    
    

    @RequestMapping(method = RequestMethod.POST)
    public ResponseEntity<?> addUsuario(@RequestBody Usuario u) {
        try {
            //Registrar dato
            cdg.addNewUsuario(u);
            return new ResponseEntity<>(HttpStatus.CREATED);
        } catch (CamposDeGuerraPersistenceException ex) {
            Logger.getLogger(CamposDeGuerraAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.FORBIDDEN);
        }

    }
    
    @RequestMapping(method = RequestMethod.PUT)
    public ResponseEntity<?> updateUsuario(@RequestBody Usuario u) {
        try {
            //Actualizar dato
            cdg.updateUsuario(u);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (CamposDeGuerraPersistenceException ex) {
            Logger.getLogger(CamposDeGuerraAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.FORBIDDEN);
        }
    }
    
    @RequestMapping(path = "/{user}", method = RequestMethod.PUT)
    public ResponseEntity<?> updateMachine(@PathVariable Usuario user, @RequestBody Maquina machine){
        try{
            cdg.updateMaquina(user, machine);
            return new ResponseEntity<>(HttpStatus.OK);
        }catch(CamposDeGuerraPersistenceException ex){
            Logger.getLogger(CamposDeGuerraAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.FORBIDDEN);
        }
    }
    
    
    @RequestMapping(path = "/{user}",method = RequestMethod.DELETE)
    public ResponseEntity<?> deleteUsuario(@PathVariable String user) {
        try {
            //Borrar dato
            cdg.deleteUsuario(user);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (CamposDeGuerraPersistenceException ex) {
            Logger.getLogger(CamposDeGuerraAPIController.class.getName()).log(Level.SEVERE, null, ex);
            return new ResponseEntity<>(ex.getMessage(), HttpStatus.FORBIDDEN);
        }
    }
    
    
}
