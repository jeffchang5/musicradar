package com.example.jeffreychang.musicradar;

import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.widget.Button;
import android.widget.EditText;
import android.view.View;
import com.example.jeffreychang.musicradar.LoginService;

import android.content.Intent;

public class MusicRadar extends AppCompatActivity {
    String editName;
    String editPassword;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_music_radar);
        final Button b= (Button) findViewById(R.id.submit);
        final EditText editName = (EditText) findViewById(R.id.name);
        final EditText editPassword = (EditText) findViewById(R.id.password);
        this.editName = editName.getText.toString();
        this.editPassword = editPassword.getText.toString();
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_music_radar, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }

    public void startLogin(View view) {
        LoginService loginService = new LoginService();
        loginService.sendCredentials(editName,editPassword);
//        Intent intent = new Intent(this, DisplayMessageActivity.class);

    }

}
