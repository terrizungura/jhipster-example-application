package com.mycompany.myapp.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A WishList.
 */
@Entity
@Table(name = "wish_list")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class WishList implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "title")
    private String title;

    @Column(name = "restricted")
    private Boolean restricted;

    @OneToMany(mappedBy = "wishList")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "address", "wishList" }, allowSetters = true)
    private Set<Customer> customers = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "wishLists", "categories" }, allowSetters = true)
    private Product product;

    // jhipster-needle-entity-add-field - JHipster will add fields here
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public WishList id(Long id) {
        this.id = id;
        return this;
    }

    public String getTitle() {
        return this.title;
    }

    public WishList title(String title) {
        this.title = title;
        return this;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Boolean getRestricted() {
        return this.restricted;
    }

    public WishList restricted(Boolean restricted) {
        this.restricted = restricted;
        return this;
    }

    public void setRestricted(Boolean restricted) {
        this.restricted = restricted;
    }

    public Set<Customer> getCustomers() {
        return this.customers;
    }

    public WishList customers(Set<Customer> customers) {
        this.setCustomers(customers);
        return this;
    }

    public WishList addCustomer(Customer customer) {
        this.customers.add(customer);
        customer.setWishList(this);
        return this;
    }

    public WishList removeCustomer(Customer customer) {
        this.customers.remove(customer);
        customer.setWishList(null);
        return this;
    }

    public void setCustomers(Set<Customer> customers) {
        if (this.customers != null) {
            this.customers.forEach(i -> i.setWishList(null));
        }
        if (customers != null) {
            customers.forEach(i -> i.setWishList(this));
        }
        this.customers = customers;
    }

    public Product getProduct() {
        return this.product;
    }

    public WishList product(Product product) {
        this.setProduct(product);
        return this;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof WishList)) {
            return false;
        }
        return id != null && id.equals(((WishList) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "WishList{" +
            "id=" + getId() +
            ", title='" + getTitle() + "'" +
            ", restricted='" + getRestricted() + "'" +
            "}";
    }
}
