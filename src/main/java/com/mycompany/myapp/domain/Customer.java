package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Customer.
 */
@Entity
@Table(name = "customer")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class Customer implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_n_ame")
    private String lastNAme;

    @Column(name = "email")
    private String email;

    @Column(name = "telephone")
    private String telephone;

    @OneToMany(mappedBy = "customer")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "customer" }, allowSetters = true)
    private Set<Address> firstNames = new HashSet<>();

    @OneToMany(mappedBy = "customer")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "titles", "customer" }, allowSetters = true)
    private Set<WishList> firstNames = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Customer id(Long id) {
        this.id = id;
        return this;
    }

    public String getFirstName() {
        return this.firstName;
    }

    public Customer firstName(String firstName) {
        this.firstName = firstName;
        return this;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastNAme() {
        return this.lastNAme;
    }

    public Customer lastNAme(String lastNAme) {
        this.lastNAme = lastNAme;
        return this;
    }

    public void setLastNAme(String lastNAme) {
        this.lastNAme = lastNAme;
    }

    public String getEmail() {
        return this.email;
    }

    public Customer email(String email) {
        this.email = email;
        return this;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelephone() {
        return this.telephone;
    }

    public Customer telephone(String telephone) {
        this.telephone = telephone;
        return this;
    }

    public void setTelephone(String telephone) {
        this.telephone = telephone;
    }

    public Set<Address> getFirstNames() {
        return this.firstNames;
    }

    public Customer firstNames(Set<Address> addresses) {
        this.setFirstNames(addresses);
        return this;
    }

    public Customer addFirstName(Address address) {
        this.firstNames.add(address);
        address.setCustomer(this);
        return this;
    }

    public Customer removeFirstName(Address address) {
        this.firstNames.remove(address);
        address.setCustomer(null);
        return this;
    }

    public void setFirstNames(Set<Address> addresses) {
        if (this.firstNames != null) {
            this.firstNames.forEach(i -> i.setCustomer(null));
        }
        if (addresses != null) {
            addresses.forEach(i -> i.setCustomer(this));
        }
        this.firstNames = addresses;
    }

    public Set<WishList> getFirstNames() {
        return this.firstNames;
    }

    public Customer firstNames(Set<WishList> wishLists) {
        this.setFirstNames(wishLists);
        return this;
    }

    public Customer addFirstName(WishList wishList) {
        this.firstNames.add(wishList);
        wishList.setCustomer(this);
        return this;
    }

    public Customer removeFirstName(WishList wishList) {
        this.firstNames.remove(wishList);
        wishList.setCustomer(null);
        return this;
    }

    public void setFirstNames(Set<WishList> wishLists) {
        if (this.firstNames != null) {
            this.firstNames.forEach(i -> i.setCustomer(null));
        }
        if (wishLists != null) {
            wishLists.forEach(i -> i.setCustomer(this));
        }
        this.firstNames = wishLists;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Customer)) {
            return false;
        }
        return id != null && id.equals(((Customer) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Customer{" +
            "id=" + getId() +
            ", firstName='" + getFirstName() + "'" +
            ", lastNAme='" + getLastNAme() + "'" +
            ", email='" + getEmail() + "'" +
            ", telephone='" + getTelephone() + "'" +
            "}";
    }
}
